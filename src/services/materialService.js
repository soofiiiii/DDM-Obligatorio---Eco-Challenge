import * as SQLite from 'expo-sqlite';

let db;

export function getDatabase() {
  if (!db) {
    db = SQLite.openDatabaseSync('ecochallenge.db');
  }
  return db;
}

export const initMateriales = () => {
  const db = getDatabase();
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS materiales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        categoria TEXT,
        imagen TEXT
      );
    `);
  } catch (error) {
    console.error('Error al inicializar la tabla de materiales:', error);
    throw error;
  }
};

export const getMateriales = () => {
  const db = getDatabase();
  try {
    const rows = db.getAllSync('SELECT * FROM materiales;');
    return rows;
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    throw error;
  }
};

export const insertMaterial = (material) => {
  const db = getDatabase();
  const { nombre, categoria, imagen } = material;

  try {
    const result = db.runSync(
      `INSERT INTO materiales (nombre, categoria, imagen) VALUES (?, ?, ?);`,
      [nombre, categoria, imagen]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al guardar material:', error);
    throw error;
  }
};

export const clearMateriales = () => {
  const db = getDatabase();
  try {
    db.execSync('DELETE FROM materiales;');
  } catch (error) {
    console.error('Error al limpiar materiales:', error);
    throw error;
  }
};