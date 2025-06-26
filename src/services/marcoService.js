import * as SQLite from 'expo-sqlite'; 
import { MARCOS_DISPONIBLES } from '../utils/marcos';


let dbInstanceMarco = null;

export function getDatabase() {
  if (!dbInstanceMarco) {
    dbInstanceMarco = SQLite.openDatabaseSync('ecochallenge.db');
    console.log('Database opened synchronously for marcoService: ecochallenge.db');
  }
  return dbInstanceMarco;
}

// Inicializa la tabla de marcos
export const initMarcos = () => { 
  const db = getDatabase(); 
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS marcos_usuario (
        emailUsuario TEXT NOT NULL,
        idMarco INTEGER NOT NULL,
        PRIMARY KEY (emailUsuario, idMarco)
      );
    `);
    db.execSync(`
      CREATE TABLE IF NOT EXISTS marco_seleccionado (
        emailUsuario TEXT PRIMARY KEY,
        idMarco INTEGER NOT NULL
      );
    `);
    console.log('Tablas de marcos inicializadas o ya existentes.');
  } catch (error) {
    console.error('Error al inicializar las tablas de marcos:', error);
    throw error;
  }
};

export const obtenerMarcos = () => MARCOS_DISPONIBLES;

export const obtenerMarcosUsuario = (email) => { 
  const db = getDatabase();
  try {
    const rows = db.getAllSync(`SELECT idMarco FROM marcos_usuario WHERE emailUsuario = ?;`, [email]);
    return rows.map(m => m.idMarco);
  } catch (error) {
    console.error(`Error al obtener marcos de usuario para ${email}:`, error);
    return []; // Devuelve un array vacío en caso de error
  }
};

export const adquirirMarco = (email, idMarco) => { 
  const db = getDatabase(); 
  try {
    // Primero, verifica si ya lo tiene para evitar errores de clave primaria
    const existing = db.getFirstSync(
      `SELECT 1 FROM marcos_usuario WHERE emailUsuario = ? AND idMarco = ?;`,
      [email, idMarco]
    );

    if (existing) {
      console.log(`Marco ${idMarco} ya adquirido por ${email}.`);
      return false; // No se adquirió (ya lo tenía)
    } else {
      const result = db.runSync(
        `INSERT INTO marcos_usuario (emailUsuario, idMarco) VALUES (?, ?);`,
        [email, idMarco]
      );
      console.log(`Marco ${idMarco} adquirido por ${email} con éxito.`);
      return result.changes > 0; // true si se insertó, false si no
    }
  } catch (error) {
    console.error(`Error al adquirir marco ${idMarco} para ${email}:`, error);
    throw error; // Propagar el error para manejo superior si es necesario
  }
};

export const establecerMarcoSeleccionado = (email, idMarco) => { 
  const db = getDatabase(); 
  try {
    // Verifica si el usuario ya tiene ese marco adquirido
    const acquired = db.getFirstSync(
      `SELECT 1 FROM marcos_usuario WHERE emailUsuario = ? AND idMarco = ?;`,
      [email, idMarco]
    );

    if (!acquired) {
      // Si el usuario no ha adquirido el marco, no puede seleccionarlo
      throw new Error('El usuario no ha adquirido este marco.');
    }

    // INSERT OR REPLACE: si ya existe una selección para este usuario, la actualiza
    // Si no existe, inserta una nueva
    const result = db.runSync(
      `INSERT OR REPLACE INTO marco_seleccionado (emailUsuario, idMarco) VALUES (?, ?);`,
      [email, idMarco]
    );
    console.log(`Marco ${idMarco} establecido como seleccionado para ${email}.`);
    return result.changes > 0; // true si se insertó/actualizó
  } catch (error) {
    console.error(`Error al establecer marco ${idMarco} seleccionado para ${email}:`, error);
    throw error;
  }
};

export const obtenerMarcoSeleccionado = (email) => {
  const db = getDatabase();
  try {
    const result = db.getFirstSync(
      `SELECT idMarco FROM marco_seleccionado WHERE emailUsuario = ? LIMIT 1;`,
      [email]
    );
    return result ? result.idMarco : null; // Devuelve el idMarco o null si no hay selección
  } catch (error) {
    console.error(`Error al obtener marco seleccionado para ${email}:`, error);
    return null; // Devuelve null en caso de error
  }
};