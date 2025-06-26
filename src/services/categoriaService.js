import * as SQLite from 'expo-sqlite';
import { getDatabase } from './userService';

// Inicializa la tabla de categorías si no existe
export const initCategorias = () => {
  const dbInstance = getDatabase(); 
  try {
    dbInstance.execSync(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE
      );
    `);
    console.log("Tabla de categorías inicializada o ya existente.");
  } catch (error) {
    console.error('Error al inicializar la tabla de categorías:', error);
    throw error;
  }
};

export const resetCategorias = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync("DROP TABLE IF EXISTS categorias;"); // Borra la tabla si existe
    initCategorias(); // Vuelve a crear la tabla con el esquema correcto
    console.log("Tabla categorías reiniciada.");
  } catch (error) {
    console.error("Error al reiniciar la tabla categorías:", error);
    throw error;
  }
};


export const getCategorias = () => {
  const dbInstance = getDatabase(); 
  try {
    const rows = dbInstance.getAllSync('SELECT * FROM categorias;');
    return rows;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};


export const insertCategoria = (nombre) => {
  const dbInstance = getDatabase(); 
  try {
    const existing = dbInstance.getFirstSync(
      'SELECT 1 FROM categorias WHERE LOWER(nombre) = LOWER(?);',
      [nombre]
    );
    if (existing) {
      console.log(`Categoría '${nombre}' ya existe.`);
      return false;
    } else {
      const result = dbInstance.runSync(
        'INSERT INTO categorias (nombre) VALUES (?);',
        [nombre.trim()]
      );
      console.log(`Categoría '${nombre}' insertada con ID: ${result.lastInsertRowId}`);
      return result.lastInsertRowId;
    }
  } catch (error) {
    console.error('Error al guardar categoría:', error);
    throw error;
  }
};


export const preloadCategorias = (nombres) => {
  const dbInstance = getDatabase(); 
  try {
    const currentCount = dbInstance.getFirstSync('SELECT COUNT(*) AS total FROM categorias;').total;
    if (currentCount > 0) {
      console.log("Ya existen categorías, no se precargan nuevas.");
      return;
    }

    dbInstance.execSync('BEGIN TRANSACTION;');
    nombres.forEach(nombre => {
      dbInstance.runSync(
        'INSERT OR IGNORE INTO categorias (nombre) VALUES (?);',
        [nombre]
      );
    });
    dbInstance.execSync('COMMIT;');
    console.log("Categorías precargadas con éxito.");
  } catch (error) {
    dbInstance.execSync('ROLLBACK;');
    console.error('Error al precargar categorías:', error);
    throw error;
  }
};

// Limpia todas las categorías (uso para pruebas o reinicio).
export const clearCategorias = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync('DELETE FROM categorias;');
    console.log("Categorías limpiadas.");
  } catch (error) {
    console.error('Error al limpiar categorías:', error);
    throw error;
  }
};
