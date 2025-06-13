import * as SQLite from 'expo-sqlite';

let db;

// Conexión única a la base de datos
export function getDatabase() {
  if (!db) {
    db = SQLite.openDatabaseSync('ecochallenge.db');
  }
  return db;
}

// Inicializa la tabla de categorías si no existe
export const initCategorias = () => {
  const db = getDatabase();
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE
      );
    `);
  } catch (error) {
    console.error('Error al inicializar la tabla de categorías:', error);
    throw error;
  }
};

// Obtiene todas las categorías, y si no hay, precarga las básicas
export const getCategorias = () => {
  const db = getDatabase();
  try {
    let rows = db.getAllSync('SELECT * FROM categorias;');
    if (rows.length === 0) {
      const categoriasBase = [
        'Plástico',
        'Papel',
        'Vidrio',
        'Electrónicos',
        'Orgánico'
      ];
      precargarCategorias(categoriasBase);
      rows = db.getAllSync('SELECT * FROM categorias;');
    }
    return rows;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

// Inserta una nueva categoría si no existe (ignora mayúsculas/minúsculas)
export const insertCategoria = (nombre) => {
  const db = getDatabase();
  try {
    const existing = db.getFirstSync(
      'SELECT 1 FROM categorias WHERE LOWER(nombre) = LOWER(?);',
      [nombre]
    );
    if (existing) {
      return false;
    } else {
      const result = db.runSync(
        'INSERT INTO categorias (nombre) VALUES (?);',
        [nombre.trim()]
      );
      return result.lastInsertRowId;
    }
  } catch (error) {
    console.error('Error al guardar categoría:', error);
    throw error;
  }
};

// Precarga una lista de nombres de categorías si no hay ninguna
const precargarCategorias = (nombres) => {
  const db = getDatabase();
  try {
    // Iniciar una transacción para asegurar que todas las inserciones se completen o ninguna
    db.execSync('BEGIN TRANSACTION;');
    nombres.forEach(nombre => {
      // Usamos db.runSync para cada inserción
      db.runSync(
        'INSERT OR IGNORE INTO categorias (nombre) VALUES (?);',
        [nombre]
      );
    });
    // Confirmar la transacción
    db.execSync('COMMIT;');
  } catch (error) {
    // Si hay un error, revertir la transacción
    db.execSync('ROLLBACK;');
    console.error('Error al precargar categorías:', error);
    throw error;
  }
};

// Limpia todas las categorías (uso para pruebas o reinicio)
export const clearCategorias = () => {
  const db = getDatabase();
  try {
    db.execSync('DELETE FROM categorias;');
  } catch (error) {
    console.error('Error al limpiar categorías:', error);
    throw error;
  }
};