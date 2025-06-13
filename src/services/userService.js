import * as SQLite from 'expo-sqlite';

let db;

export function getDatabase() {
  if (!db) {
    db = SQLite.openDatabaseSync('ecochallenge.db');
  }
  return db;
}

export const initDB = () => {
  const db = getDatabase();
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT UNIQUE,
        edad INTEGER,
        barrio TEXT,
        foto TEXT
      );
      CREATE TABLE IF NOT EXISTS sesion (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        usuario TEXT
      );
    `);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
};

export const getAllUsers = () => {
  const db = getDatabase();
  try {
    const rows = db.getAllSync('SELECT * FROM usuarios;');
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const emailExists = (email) => {
  const db = getDatabase();
  try {
    const row = db.getFirstSync('SELECT 1 FROM usuarios WHERE email = ? LIMIT 1;', [email]);
    return row !== null;
  } catch (error) {
    console.error('Error al verificar email:', error);
    throw error;
  }
};

export const insertUser = (usuario) => {
  const db = getDatabase();
  const { nombre, email, edad, barrio, foto } = usuario;
  try {
    const result = db.runSync('INSERT INTO usuarios (nombre, email, edad, barrio, foto) VALUES (?, ?, ?, ?, ?);', [nombre, email, edad, barrio, foto]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    throw error;
  }
};

export const clearUsers = () => {
  const db = getDatabase();
  try {
    db.execSync('DELETE FROM usuarios;');
  } catch (error) {
    console.error('Error al limpiar usuarios:', error);
    throw error;
  }
};

export const guardarSesion = (usuario) => {
  const db = getDatabase();
  try {
    const userStr = JSON.stringify(usuario);
    db.execSync('DELETE FROM sesion;'); // Eliminar la sesión existente
    db.runSync('INSERT OR REPLACE INTO sesion (id, usuario) VALUES (1, ?);', [userStr]); // Insertar o reemplazar la nueva sesión
  } catch (error) {
    console.error('Error al guardar sesión:', error);
    throw error;
  }
};

export const obtenerSesion = () => {
  const db = getDatabase();
  try {
    const row = db.getFirstSync('SELECT usuario FROM sesion WHERE id = 1;');
    if (row) {
      const usuario = JSON.parse(row.usuario);
      return usuario;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    throw error;
  }
};

export const cerrarSesion = () => {
  const db = getDatabase();
  try {
    db.execSync('DELETE FROM sesion;');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};