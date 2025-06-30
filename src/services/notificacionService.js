import { getDatabase } from "../database/db";

export const initNotificaciones = () => {
  const db = getDatabase();
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idReto INTEGER,
        titulo TEXT,
        mensaje TEXT,
        fecha TEXT,
        leido INTEGER DEFAULT 0
      );
    `);
  } catch (error) {
    console.error("Error al crear tabla notificaciones:", error);
  }
};

export const insertarNotificacion = (idReto, titulo, mensaje, fecha = new Date()) => {
  const db = getDatabase();
  try {
    db.runSync(
      `INSERT INTO notificaciones (idReto, titulo, mensaje, fecha) VALUES (?, ?, ?, ?)`,
      [idReto, titulo, mensaje, fecha.toISOString()]
    );
  } catch (error) {
    console.error("Error al insertar notificación:", error);
  }
};

export const getNotificaciones = () => {
  const db = getDatabase();
  try {
    return db.getAllSync(`SELECT * FROM notificaciones ORDER BY fecha DESC`);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
};

export const marcarComoLeida = (id) => {
  const db = getDatabase();
  try {
    db.runSync(`UPDATE notificaciones SET leido = 1 WHERE id = ?`, [id]);
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
  }
};

export const borrarNotificaciones = () => {
  const db = getDatabase();
  try {
    db.runSync(`DELETE FROM notificaciones`);
  } catch (error) {
    console.error("Error al borrar notificaciones:", error);
  }
};
