import { getDatabase } from "../database/db";

// Función auxiliar para verificar si un reto está activo
export const isRetoActivo = (reto) => {
  // Si el reto o sus fechas no están definidos, no puede estar activo
  if (!reto || !reto.fechaInicio || !reto.fechaLimite) {
    return false;
  }
  const currentDate = new Date();
  const startDate = new Date(reto.fechaInicio);
  const endDate = new Date(reto.fechaLimite);

  // Un reto está activo si la fecha actual es igual o posterior a la fecha de inicio
  // Y la fecha actual es igual o anterior a la fecha límite.
  return currentDate >= startDate && currentDate <= endDate;
};

export const initRetos = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync(`
      CREATE TABLE IF NOT EXISTS retos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        categoriaId INTEGER,
        puntaje INTEGER DEFAULT 0,
        latitud REAL,
        longitud REAL,
        radio REAL,
        foto TEXT,
        fechaInicio TEXT,
        fechaLimite TEXT,
        direccion TEXT,
        departamento TEXT,
        FOREIGN KEY (categoriaId) REFERENCES categorias(id)
      );
    `);

    // Intentar añadir columnas si no existen
    try {
      dbInstance.execSync("ALTER TABLE retos ADD COLUMN fechaInicio TEXT;");
    } catch (e) {
      if (!e.message.includes("duplicate column name: fechaInicio")) {
        console.warn("Error al agregar columna fechaInicio:", e.message);
      }
    }

    try {
      dbInstance.execSync("ALTER TABLE retos ADD COLUMN fechaLimite TEXT;");
    } catch (e) {
      if (!e.message.includes("duplicate column name: fechaLimite")) {
        console.warn("Error al agregar columna fechaLimite:", e.message);
      }
    }

  } catch (error) {
    console.error("Error al inicializar la tabla de retos:", error);
    throw error;
  }
};

export const resetRetos = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync("DROP TABLE IF EXISTS retos;");
    initRetos();
  } catch (error) {
    console.error("Error al reiniciar la tabla retos:", error);
    throw error;
  }
};

export const insertReto = (reto) => {
  const dbInstance = getDatabase();
  const {
    nombre,
    descripcion,
    categoriaId,
    puntaje,
    latitud,
    longitud,
    radio,
    direccion,
    departamento,
    foto,
    fechaInicio,
    fechaLimite,
  } = reto;

  try {
    const parsedCategoriaId =
      typeof categoriaId === "number" && !isNaN(categoriaId)
        ? categoriaId
        : null;

    const result = dbInstance.runSync(
      `INSERT INTO retos (
    nombre, descripcion, categoriaId, puntaje, latitud, longitud, radio,
    direccion, departamento, foto, fechaInicio, fechaLimite
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        nombre,
        descripcion,
        parsedCategoriaId,
        puntaje,
        latitud,
        longitud,
        radio,
        direccion,
        departamento,
        foto,
        fechaInicio,
        fechaLimite,
      ]
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error al insertar reto:", error);
    throw error;
  }
};

export const getRetos = (
  limit,
  offset,
  searchTerm = "",
  categoryId = null,
  orderByDate = null,
  orderByPoints = null
) => {
  const dbInstance = getDatabase();
  let query = `
    SELECT r.*, c.nombre AS categoriaNombre
    FROM retos r
    LEFT JOIN categorias c ON r.categoriaId = c.id
    WHERE 1=1
  `;
  let params = [];
  let orderByClauses = []; // Array para almacenar las cláusulas ORDER BY

  if (searchTerm) {
    query += ` AND r.nombre LIKE ?`;
    params.push(`%${searchTerm}%`);
  }

  if (categoryId !== null) {
    const parsedCategoriaId = parseInt(categoryId);
    if (!isNaN(parsedCategoriaId)) {
      query += ` AND r.categoriaId = ?`;
      params.push(parsedCategoriaId);
    }
  }

  // Añadir ordenamiento por fecha
  if (orderByDate) {
    if (orderByDate === "asc") {
      orderByClauses.push(`r.fechaInicio ASC`);
    } else if (orderByDate === "desc") {
      orderByClauses.push(`r.fechaInicio DESC`);
    }
  }

  // Añadir ordenamiento por puntos
  if (orderByPoints) {
    if (orderByPoints === "asc") {
      orderByClauses.push(`r.puntaje ASC`);
    } else if (orderByPoints === "desc") {
      orderByClauses.push(`r.puntaje DESC`);
    }
  }

  if (orderByClauses.length === 0) {
    orderByClauses.push(`r.id DESC`); // Orden por defecto: los retos más nuevos primero
  }

  // Combinar todas las cláusulas ORDER BY
  query += ` ORDER BY ` + orderByClauses.join(", ");

  query += ` LIMIT ? OFFSET ?;`; // LIMIT y OFFSET siempre van al final
  params.push(parseInt(limit) || 10, parseInt(offset) || 0);

  try {
    const rows = dbInstance.getAllSync(query, params);
    return rows;
  } catch (error) {
    console.error("Error al obtener retos:", error);
    return [];
  }
};

export const getRetosCount = (
  searchTerm = "",
  categoryId = null,
  orderByDate = null,
  orderByPoints = null
) => {
  const dbInstance = getDatabase();
  let query = `SELECT COUNT(*) AS total FROM retos WHERE 1=1`;
  let params = [];

  if (searchTerm) {
    query += ` AND nombre LIKE ?`;
    params.push(`%${searchTerm}%`);
  }

  if (categoryId !== null) {
    query += ` AND categoriaId = ?`;
    params.push(categoryId);
  }

  try {
    const row = dbInstance.getFirstSync(query, params);
    return row.total || 0;
  } catch (error) {
    console.error("Error al contar retos:", error);
    return 0;
  }
};

export const clearRetos = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync("DELETE FROM retos;");
 } catch (error) {
    console.error("Error al limpiar retos:", error);
    throw error;
  }
};


export const getRetoPorId = (id) => {
  const dbInstance = getDatabase();
  try {
    const row = dbInstance.getFirstSync(
      `SELECT r.*, c.nombre AS categoriaNombre
       FROM retos r
       LEFT JOIN categorias c ON r.categoriaId = c.id
       WHERE r.id = ?;`,
      [id]
    );
    return row;
  } catch (error) {
    console.error("Error al obtener el reto por ID:", error);
    return null;
  }
};

export const updateReto = (id, retoActualizado) => {
  const dbInstance = getDatabase();
  const {
    nombre,
    descripcion,
    categoriaId,
    puntaje,
    latitud,
    longitud,
    radio,
    direccion,
    departamento,
    foto,
    fechaInicio,
    fechaLimite,
  } = retoActualizado;

  try {
    const parsedCategoriaId =
      typeof categoriaId === "number" && !isNaN(categoriaId)
        ? categoriaId
        : null;

    const result = dbInstance.runSync(
      `UPDATE retos
   SET nombre = ?, descripcion = ?, categoriaId = ?, puntaje = ?, latitud = ?,
       longitud = ?, radio = ?, direccion = ?, departamento = ?, foto = ?,
       fechaInicio = ?, fechaLimite = ?
   WHERE id = ?;`,
      [
        nombre,
        descripcion,
        parsedCategoriaId,
        puntaje,
        latitud,
        longitud,
        radio,
        direccion,
        departamento,
        foto,
        fechaInicio,
        fechaLimite,
        id,
      ]
    );

    return result.changes > 0;
  } catch (error) {
    console.error("Error al actualizar reto:", error);
    throw error;
  }
};

export const deleteReto = (id) => {
  const dbInstance = getDatabase();
  try {
    const result = dbInstance.runSync(`DELETE FROM retos WHERE id = ?;`, [id]);
    return result.changes > 0;
  } catch (error) {
    console.error("Error al eliminar reto:", error);
    throw error;
  }
};
