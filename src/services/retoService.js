import * as SQLite from 'expo-sqlite';

let db;

export function getDatabase() {
  if (!db) {
    db = SQLite.openDatabaseSync('ecochallenge.db');
    // **Importante:** Llama a initRetos aquí para asegurar que la tabla exista
    initRetos(); 
  }
  return db;
}

export const initRetos = () => {
  const db = getDatabase(); // Esto puede causar un bucle infinito si se llama antes de db estar definido.
                           // La mejor práctica es pasar 'db' como argumento o asegurar que 'db' ya esté inicializado.
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS retos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        descripcion TEXT,
        categoria INTEGER,
        fechaInicio TEXT,
        fechaLimite TEXT,
        puntaje INTEGER
      );
    `);
    console.log('Tabla de retos inicializada correctamente.'); // Agrega un log para confirmar
  } catch (error) {
    console.error('Error al inicializar la tabla de retos:', error);
    throw error;
  }
};

export const getRetos = () => {
  const db = getDatabase();
  try {
    const rows = db.getAllSync('SELECT * FROM retos;');
    return rows;
  } catch (error) {
    console.error('Error al obtener retos:', error);
    throw error;
  }
};

export const insertReto = (nuevoReto) => {
  const db = getDatabase();
  const {
    nombre,
    descripcion,
    categoria, // ahora es ID (entero)
    fechaInicio,
    fechaLimite,
    puntaje
  } = nuevoReto;

  // Validaciones
  if (!nombre || !descripcion || !categoria || !fechaInicio || !fechaLimite || !puntaje) {
    console.error('Error: campos incompletos en el reto.');
    return false;
  }

  const inicio = new Date(fechaInicio);
  const limite = new Date(fechaLimite);

  if (inicio > limite) {
    console.error('Error: fecha de inicio posterior a la fecha límite.');
    return false;
  }

  try {
    const result = db.runSync(
      `INSERT INTO retos (nombre, descripcion, categoria, fechaInicio, fechaLimite, puntaje)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        nombre,
        descripcion,
        parseInt(categoria),
        fechaInicio,
        fechaLimite,
        parseInt(puntaje)
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al guardar reto:', error);
    throw error;
  }
};

export const clearRetos = () => {
  const db = getDatabase();
  try {
    db.execSync('DELETE FROM retos;');
  } catch (error) {
    console.error('Error al limpiar retos:', error);
    throw error;
  }
};