import * as SQLite from 'expo-sqlite';
import { calcularDistanciaEnMetros } from '../utils/gps';
import { getRetos } from './retoService';

let dbInstanceParticipacion = null;

export function getDatabase() {
  if (!dbInstanceParticipacion) {
    dbInstanceParticipacion = SQLite.openDatabaseSync('ecochallenge.db');
    console.log('Database opened synchronously for participacionService: ecochallenge.db');
  }
  return dbInstanceParticipacion;
}

export const initParticipaciones = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync(`
      CREATE TABLE IF NOT EXISTS participaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idReto INTEGER,
        emailUsuario TEXT,
        foto TEXT, 
        latitud REAL,
        longitud REAL,
        comentario TEXT,
        estado TEXT
      );
    `);
    console.log('Tabla de participaciones inicializada o ya existente.');
  } catch (error) {
    console.error('Error al inicializar la tabla de participaciones:', error);
    throw error;
  }
};

export const resetParticipaciones = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync('DROP TABLE IF EXISTS participaciones;');
    initParticipaciones();
    console.log('Tabla participaciones reiniciada.');
  } catch (error) {
    console.error('Error al reiniciar la tabla participaciones:', error);
    throw error;
  }
};

export const getParticipaciones = () => {
  const dbInstance = getDatabase();
  try {
    const rows = dbInstance.getAllSync(`
      SELECT p.*, r.nombre AS nombreReto
      FROM participaciones p
      JOIN retos r ON p.idReto = r.id;
    `);
    return rows.map(row => ({
      ...row,
      fotos: row.foto ? JSON.parse(row.foto) : []
    }));
  } catch (error) {
    console.error('Error al obtener participaciones:', error);
    throw error;
  }
};

export const insertParticipacion = (participacion) => {
  const dbInstance = getDatabase();
  const { idReto, emailUsuario, fotos, latitud, longitud, comentario, estado } = 
    participacion;

  // Validar que 'fotos' sea un array y tenga al menos un elemento
  if (
    !idReto ||
    !emailUsuario ||
    !Array.isArray(fotos) || fotos.length === 0 || 
    typeof latitud !== 'number' ||
    typeof longitud !== 'number'
  ) {
    console.error('Participación inválida. Faltan datos esenciales o el formato de las fotos es incorrecto.');
    return false;
  }

  // Convertir el array de URIs de fotos a una cadena JSON
  const fotosJsonString = JSON.stringify(fotos);

  try {
    // Obtener la información completa del reto para validar las fechas
    const todosLosRetos = getRetos(); 
    const retoDetalle = todosLosRetos.find(r => r.id === idReto);

    if (!retoDetalle) {
        console.error(`Error: No se encontró el reto con ID ${idReto}.`);
        return false;
    }

    const currentDate = new Date();
    const startDate = new Date(retoDetalle.fechaInicio);
    const endDate = new Date(retoDetalle.fechaLimite);

    // Validación de fechas: El reto debe haber empezado y no haber terminado.
    if (currentDate < startDate) {
        console.warn(`Participación no permitida: El reto "${retoDetalle.nombre}" aún no ha iniciado (comienza el ${retoDetalle.fechaInicio}).`);
        return false;
    }

    if (currentDate > endDate) {
        console.warn(`Participación no permitida: El reto "${retoDetalle.nombre}" ya ha finalizado (terminó el ${retoDetalle.fechaLimite}).`);
        return false;
    }

    const reto = dbInstance.getFirstSync(
      'SELECT latitud, longitud, radio FROM retos WHERE id = ?;',
      [idReto]
    );

    let dentroDelRadio = true;
    if (reto?.latitud != null && reto?.longitud != null && reto?.radio != null) {
      const distancia = calcularDistanciaEnMetros(
        reto.latitud, reto.longitud, latitud, longitud
      );
      dentroDelRadio = distancia <= reto.radio;
    }

    if (!dentroDelRadio) {
      console.warn('Usuario fuera del área permitida del reto.');
    }

    const result = dbInstance.runSync(
      `INSERT INTO participaciones
        (idReto, emailUsuario, foto, latitud, longitud, comentario, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [idReto, emailUsuario, fotosJsonString, latitud, longitud, comentario, estado] // Usar fotosJsonString
    );

    return result?.lastInsertRowId ?? false;
  } catch (error) {
    console.error('Error al guardar participación:', error);
    return false;
  }
};

export const clearParticipaciones = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync('DELETE FROM participaciones;');
  } catch (error) {
    console.error('Error al limpiar participaciones:', error);
    throw error;
  }
};

export const getCantidadRetosAprobadosPorUsuario = (email) => {
  const dbInstance = getDatabase();
  try {
    const row = dbInstance.getFirstSync(
      `SELECT COUNT(*) AS total FROM participaciones
       WHERE emailUsuario = ? AND estado = 'Aprobado';`,
      [email]
    );
    return row.total || 0;
  } catch (error) {
    console.error('Error al contar retos aprobados:', error);
    return 0;
  }
};

export const getPuntosTotalesPorUsuario = (email) => {
  const dbInstance = getDatabase();
  try {
    const row = dbInstance.getFirstSync(
      `SELECT SUM(r.puntaje) AS total
       FROM participaciones p
       JOIN retos r ON p.idReto = r.id
       WHERE p.emailUsuario = ? AND p.estado = 'Aprobado';`,
      [email]
    );
    return row.total || 0;
  } catch (error) {
    console.error('Error al obtener puntos acumulados:', error);
    return 0;
  }
};

export const getParticipacionesPorReto = (retoId, estado = 'Pendiente') => {
  const dbInstance = getDatabase();
  try {
    const rows = dbInstance.getAllSync(
      `SELECT * FROM participaciones
       WHERE idReto = ? AND estado = ?;`,
      [retoId, estado]
    );
    // Mapear los resultados para convertir la cadena JSON de fotos de vuelta a un array
    return rows.map(row => ({
      ...row,
      fotos: row.foto ? JSON.parse(row.foto) : []
    }));
  } catch (error) {
    console.error('Error al obtener participaciones por reto:', error);
    return [];
  }
};

export const actualizarEstadoParticipacion = (idParticipacion, nuevoEstado) => {
  const dbInstance = getDatabase();
  try {
    dbInstance.runSync(
      `UPDATE participaciones SET estado = ? WHERE id = ?;`,
      [nuevoEstado, idParticipacion]
    );
    //enviarNotificacionParticipacion(nuevoEstado);
    return true;
  } catch (error) {
    console.error('Error al actualizar estado de participación:', error);
    return false;
  }
};

/*export const enviarNotificacionParticipacion = async (estado) => {
  const mensaje =
    estado === 'Aprobado'
      ? '¡Tu participación fue aprobada! Has ganado puntos por el reto.'
      : 'Tu participación fue rechazada. Revisa los requisitos del reto e inténtalo de nuevo.';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'EcoChallenge',
      body: mensaje,
      data: { status: estado },
    },
    trigger: null,
  });
  console.log(`Notificación local programada para estado: ${estado}`);
};*/

export const getParticipacionesPendientesPorUsuario = (email) => {
  const db = getDatabase();
  try {
    const participaciones = db.getAllSync(
      `SELECT * FROM participaciones WHERE emailUsuario = ? AND estado = 'Pendiente';`,
      [email]
    );
    // Mapear los resultados para convertir la cadena JSON de fotos de vuelta a un array
    return participaciones.map(row => ({
      ...row,
      fotos: row.foto ? JSON.parse(row.foto) : []
    }));
  } catch (error) {
    console.error('Error al obtener participaciones pendientes:', error);
    return [];
  }
};

export const updateParticipacion = (idParticipacion, updates) => {
  const dbInstance = getDatabase();
  let updateParts = [];
  let updateValues = [];

  // Si 'updates' contiene 'fotos', conviértelo a JSON string
  const updatesToApply = { ...updates };
  if (updatesToApply.fotos && Array.isArray(updatesToApply.fotos)) {
    updatesToApply.foto = JSON.stringify(updatesToApply.fotos); // Almacena en la columna 'foto'
    delete updatesToApply.fotos; // Elimina la propiedad original 'fotos'
  }

  for (const key in updatesToApply) { // Itera sobre updatesToApply
    if (updatesToApply.hasOwnProperty(key)) {
      updateParts.push(`${key} = ?`);
      updateValues.push(updatesToApply[key]);
    }
  }

  if (updateParts.length === 0) {
    console.warn('No hay campos para actualizar en la participación.');
    return false;
  }

  const query = `UPDATE participaciones SET ${updateParts.join(', ')} WHERE id = ?;`;
  updateValues.push(idParticipacion);

  try {
    const result = dbInstance.runSync(query, updateValues);
    console.log(`Participación ${idParticipacion} actualizada. Cambios: ${result.changes}`);
    return result.changes > 0;
  } catch (error) {
    console.error(`Error al actualizar participación ${idParticipacion}:`, error);
    throw error;
  }
};

export const deleteParticipacion = (idParticipacion) => {
  const dbInstance = getDatabase();
  try {
    const result = dbInstance.runSync(
      `DELETE FROM participaciones WHERE id = ?;`,
      [idParticipacion]
    );
    console.log(`Participación ${idParticipacion} eliminada. Cambios: ${result.changes}`);
    return result.changes > 0;
  } catch (error) {
    console.error(`Error al eliminar participación ${idParticipacion}:`, error);
    throw error;
  }
};

export const getParticipacionesNotificablesPorUsuario = (email) => {
  const db = getDatabase();
  try {
    const rows = db.getAllSync(`
      SELECT p.*, r.nombre AS nombreReto
      FROM participaciones p
      JOIN retos r ON p.idReto = r.id
      WHERE p.emailUsuario = ? AND (p.estado = 'Aprobado' OR p.estado = 'Rechazada')
      ORDER BY p.id DESC;
    `, [email]);

    return rows.map(row => ({
      ...row,
      fotos: row.foto ? JSON.parse(row.foto) : [],
    }));
  } catch (error) {
    console.error('Error al obtener participaciones notificables:', error);
    return [];
  }
};
