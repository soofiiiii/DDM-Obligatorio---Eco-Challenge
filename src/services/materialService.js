import { getDatabase } from "../database/db";

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

export const getMateriales = (limit = 10, offset = 0, searchTerm = "") => {
  const db = getDatabase();
   try {
    let query = "SELECT * FROM materiales";
    const params = [];

    if (searchTerm) {
      query += " WHERE LOWER(nombre) LIKE ?";
      params.push(`%${searchTerm.toLowerCase()}%`);
    }

    query += " ORDER BY id DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const rows = db.getAllSync(query, params);
    return rows;
  } catch (error) {
    console.error("Error al obtener materiales:", error);
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

export const deleteMaterial = (id) => {
  const db = getDatabase();
  try {
    const result = db.runSync("DELETE FROM materiales WHERE id = ?;", [id]);
    return result.changes > 0;
  } catch (error) {
    console.error("Error al eliminar material:", error);
    return false;
  }
};

export const updateMaterial = (material) => {
  const db = getDatabase();
  const { id, nombre, categoria, imagen } = material;

  try {
    db.runSync(
      `UPDATE materiales SET nombre = ?, categoria = ?, imagen = ? WHERE id = ?;`,
      [nombre, categoria, imagen, id]
    );
    return true;
  } catch (error) {
    console.error("Error al actualizar material:", error);
    return false;
  }
};
