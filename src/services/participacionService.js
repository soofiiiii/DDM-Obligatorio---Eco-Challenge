import * as SQLite from 'expo-sqlite';

let db;

// Inicializa o reutiliza la conexión a la base de datos
export function getDatabase() {
  if (!db) {
    db = SQLite.openDatabaseSync('ecochallenge.db');
  }
  return db;
}

// Crea la tabla de participaciones con latitud y longitud
export const initParticipaciones = () => {
  const db = getDatabase();
  try {
    db.execSync(`
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
  } catch (error) {
    console.error('Error al inicializar la tabla de participaciones:', error);
    throw error;
  }
};

// Elimina y recrea la tabla de participaciones — SOLO PARA USO DE DESARROLLO
export const resetParticipaciones = () => {
  const db = getDatabase();
  try {
    db.execSync('DROP TABLE IF EXISTS participaciones;');
    initParticipaciones();
    console.log('✔️ Tabla participaciones reiniciada.');
  } catch (error) {
    console.error('Error al reiniciar la tabla participaciones:', error);
    throw error;
  }
};

// Obtiene todas las participaciones existentes
export const getParticipaciones = () => {
  const db = getDatabase();
  try {
    const rows = db.getAllSync('SELECT * FROM participaciones;');
    return rows;
  } catch (error) {
    console.error('Error al obtener participaciones:', error);
    throw error;
  }
};

// Inserta una nueva participación con coordenadas GPS
export const insertParticipacion = (participacion) => {
  const db = getDatabase();
  const {
    idReto,
    emailUsuario,
    foto,
    latitud,
    longitud,
    comentario,
    estado
  } = participacion;

  // Validación mínima
  if (!idReto || !emailUsuario || !foto || typeof latitud !== 'number' || typeof longitud !== 'number') {
    console.error('Participación inválida. Faltan datos esenciales.');
    return false;
  }

  try {
    const result = db.runSync(
      `INSERT INTO participaciones 
        (idReto, emailUsuario, foto, latitud, longitud, comentario, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [idReto, emailUsuario, foto, latitud, longitud, comentario, estado]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al guardar participación:', error);
    throw error;
  }
};

// Elimina todos los registros de participaciones
export const clearParticipaciones = () => {
  const db = getDatabase();
  try {
    db.execSync('DELETE FROM participaciones;');
  } catch (error) {
    console.error('Error al limpiar participaciones:', error);
    throw error;
  }
};
