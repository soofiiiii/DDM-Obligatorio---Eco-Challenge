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
        FOREIGN KEY (categoriaId) REFERENCES categorias(id)
      );
    `);

    // Intentar añadir columnas si no existen
    try {
      dbInstance.execSync("ALTER TABLE retos ADD COLUMN fechaInicio TEXT;");
      console.log("Columna 'fechaInicio' añadida a la tabla 'retos'.");
    } catch (e) {
      if (!e.message.includes("duplicate column name: fechaInicio")) {
        console.warn("Error al agregar columna fechaInicio:", e.message);
      }
    }

    try {
      dbInstance.execSync("ALTER TABLE retos ADD COLUMN fechaLimite TEXT;");
      console.log("Columna 'fechaLimite' añadida a la tabla 'retos'.");
    } catch (e) {
      if (!e.message.includes("duplicate column name: fechaLimite")) {
        console.warn("Error al agregar columna fechaLimite:", e.message);
      }
    }

    try {
      dbInstance.execSync("ALTER TABLE retos ADD COLUMN direccion TEXT;");
      console.log("Columna 'direccion' añadida a la tabla 'retos'.");
    } catch (e) {
      if (!e.message.includes("duplicate column name: direccion")) {
        console.warn("Error al agregar columna direccion:", e.message);
      }
    }

    try {
      dbInstance.execSync("ALTER TABLE retos ADD COLUMN departamento TEXT;");
      console.log("Columna 'departamento' añadida a la tabla 'retos'.");
    } catch (e) {
      if (!e.message.includes("duplicate column name: departamento")) {
        console.warn("Error al agregar columna departamento:", e.message);
      }
    }

    console.log("Tabla de retos inicializada o ya existente.");
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
    console.log("Tabla retos reiniciada.");
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
    console.log("Tabla de retos limpiada.");
  } catch (error) {
    console.error("Error al limpiar retos:", error);
    throw error;
  }
};

export const preloadRetos = () => {
  const dbInstance = getDatabase();
  try {
    const count = getRetosCount();
    if (count > 0) {
      console.log("Ya existen retos, no se precargan nuevos.");
      return;
    }

    const categorias = dbInstance.getAllSync(
      "SELECT id, nombre FROM categorias;"
    );
    const categoriaMap = {};
    categorias.forEach((cat) => {
      categoriaMap[cat.nombre] = cat.id;
    });

    console.log("DEBUG PRELOAD RETOS INICIO");
    console.log("Categorías cargadas de la DB:", categorias);
    console.log("Mapa de categorías (nombre -> ID):", categoriaMap);

    const getFormattedDate = (daysOffset) => {
      const date = new Date();
      date.setDate(date.getDate() + daysOffset);
      return date.toISOString().split("T")[0];
    };

    const retosEjemplo = [
      {
        nombre: "Recicla 1kg de Plástico en la Rambla",
        descripcion:
          "Junta y recicla 1 kilogramo de botellas de plástico o envases en la Rambla de Paysandú.",
        categoriaNombre: "Plástico",
        puntaje: 50,
        latitud: -32.227, // Cerca de la Rambla de Paysandú
        longitud: -58.077,
        radio: 800, // Radio de 800m
        foto: "https://placehold.co/150x150/4CAF50/FFFFFF?text=Plastico",
        fechaInicio: getFormattedDate(0), // Comienza hoy
        fechaLimite: getFormattedDate(7), // Termina en 7 días
      },
      {
        nombre: "Composta tus Orgánicos en Barrio Jardín",
        descripcion:
          "Inicia una composta en casa y úsala para tus plantas en el Barrio Jardín.",
        categoriaNombre: "Orgánico",
        puntaje: 75,
        latitud: -32.235, // Barrio Jardín, Paysandú
        longitud: -58.082,
        radio: 500,
        foto: "https://placehold.co/150x150/8BC34A/FFFFFF?text=Organico",
        fechaInicio: getFormattedDate(3), // Comienza en 3 días
        fechaLimite: getFormattedDate(10), // Termina en 10 días
      },
      {
        nombre: "Día sin papel en el Centro",
        descripcion:
          "Evita el uso de papel impreso o servilletas de papel por un día en el centro de Paysandú.",
        categoriaNombre: "Papel",
        puntaje: 40,
        latitud: -32.2315, // Centro de Paysandú
        longitud: -58.075,
        radio: 1500,
        foto: "https://placehold.co/150x150/BDBDBD/FFFFFF?text=Papel",
        fechaInicio: getFormattedDate(0), // Comienza hoy
        fechaLimite: getFormattedDate(0), // Termina hoy (para probar notificaciones de fin de día)
      },
      {
        nombre: "Entrega tus Electrónicos en Zona Industrial",
        descripcion:
          "Lleva tus aparatos electrónicos en desuso a un centro de reciclaje en la zona industrial de Paysandú.",
        categoriaNombre: "Electrónicos",
        puntaje: 100,
        latitud: -32.25, // Zona industrial Paysandú
        longitud: -58.05,
        radio: 2000,
        foto: "https://placehold.co/150x150/00BCD4/FFFFFF?text=Electronicos",
        fechaInicio: getFormattedDate(1), // Comienza mañana
        fechaLimite: getFormattedDate(15), // Termina en 15 días
      },
      {
        nombre: "Recicla Vidrio en Plaza Constitución",
        descripcion:
          "Junta al menos 10 botellas de vidrio y llévalas a un contenedor cerca de Plaza Constitución.",
        categoriaNombre: "Vidrio",
        puntaje: 60,
        latitud: -32.234, // Plaza Constitución, Paysandú
        longitud: -58.0755,
        radio: 1000,
        foto: "https://placehold.co/150x150/2E7D32/FFFFFF?text=Vidrio",
        fechaInicio: getFormattedDate(-5), // Comenzó hace 5 días
        fechaLimite: getFormattedDate(2), // Termina en 2 días (ya está en curso)
      },
      {
        nombre: "Separación de Residuos en tu Hogar",
        descripcion:
          "Asegura la correcta separación de tus residuos en casa por una semana, en cualquier barrio de Paysandú.",
        categoriaNombre: "Orgánico",
        puntaje: 80,
        latitud: -32.2324, // Centro Paysandú (genérico)
        longitud: -58.0754,
        radio: 2500,
        foto: "https://placehold.co/150x150/4CAF50/FFFFFF?text=Separacion",
        fechaInicio: getFormattedDate(-10), // Comenzó hace 10 días
        fechaLimite: getFormattedDate(-3), // Terminó hace 3 días (para probar retos expirados)
      },
      {
        nombre: "Reutiliza una prenda en el Mercado",
        descripcion:
          "Da una segunda vida a una prenda de vestir donándola o transformándola, inspirándote en el mercado local.",
        categoriaNombre: "Plástico",
        puntaje: 45,
        latitud: -32.23, // Cerca del Mercado, Paysandú
        longitud: -58.07,
        radio: 800,
        foto: "https://placehold.co/150x150/8BC34A/FFFFFF?text=Reutilizar",
        fechaInicio: getFormattedDate(5), // Comienza en 5 días
        fechaLimite: getFormattedDate(12), // Termina en 12 días
      },
      {
        nombre: "Recogida de Pilas en la Universidad",
        descripcion:
          "Junta pilas usadas y llévalas a un punto de recolección especial en la zona universitaria de Paysandú.",
        categoriaNombre: "Electrónicos",
        puntaje: 70,
        latitud: -32.225, // Zona de la Udelar en Paysandú
        longitud: -58.078,
        radio: 1200,
        foto: "https://placehold.co/150x150/00BCD4/FFFFFF?text=Pilas",
        fechaInicio: getFormattedDate(1), // Comienza mañana
        fechaLimite: getFormattedDate(21), // Termina en 21 días
      },
      {
        nombre: "Reduce el Consumo de Agua en casa",
        descripcion:
          "Implementa 3 hábitos para reducir tu consumo de agua en casa, aplicable en todo Paysandú.",
        categoriaNombre: "Orgánico",
        puntaje: 65,
        latitud: -32.2324, // Centro Paysandú (genérico)
        longitud: -58.0754,
        radio: 3000,
        foto: "https://placehold.co/150x150/2E7D32/FFFFFF?text=Agua",
        fechaInicio: getFormattedDate(0), // Comienza hoy
        fechaLimite: getFormattedDate(30), // Termina en 30 días
      },
      {
        nombre: "Campaña de Conciencia Ambiental en tu Barrio",
        descripcion:
          "Comparte 3 datos importantes sobre reciclaje en redes sociales o con tus vecinos.",
        categoriaNombre: "Papel",
        puntaje: 30,
        latitud: -32.2324, // Centro Paysandú (genérico)
        longitud: -58.0754,
        radio: 5000,
        foto: "https://placehold.co/150x150/BDBDBD/FFFFFF?text=Conciencia",
        fechaInicio: getFormattedDate(-1), // Comenzó ayer
        fechaLimite: getFormattedDate(10), // Termina en 10 días
      },
      {
        nombre: "Adopta una Planta en el Parque Municipal",
        descripcion:
          "Adopta una planta y cuídala por al menos un mes, inspirándote en la flora del Parque Municipal.",
        categoriaNombre: "Orgánico",
        puntaje: 55,
        latitud: -32.238, // Parque Municipal, Paysandú
        longitud: -58.07,
        radio: 1000,
        foto: "https://placehold.co/150x150/4CAF50/FFFFFF?text=Planta",
        fechaInicio: getFormattedDate(10), // Comienza en 10 días
        fechaLimite: getFormattedDate(40), // Termina en 40 días
      },
      {
        nombre: "Compra a Granel en Tiendas Locales",
        descripcion:
          "Realiza una compra de alimentos o productos a granel en tiendas de Paysandú para reducir envases.",
        categoriaNombre: "Plástico",
        puntaje: 70,
        latitud: -32.229, // Zona comercial, Paysandú
        longitud: -58.072,
        radio: 1500,
        foto: "https://placehold.co/150x150/8BC34A/FFFFFF?text=Granel",
        fechaInicio: getFormattedDate(0), // Comienza hoy
        fechaLimite: getFormattedDate(14), // Termina en 14 días
      },
      {
        nombre: "Limpia tu Espacio Verde en la Costanera",
        descripcion:
          "Dedica 1 hora a limpiar un espacio verde cercano a la Costanera de Paysandú.",
        categoriaNombre: "Orgánico",
        puntaje: 90,
        latitud: -32.22, // Costanera, Paysandú
        longitud: -58.079,
        radio: 2000,
        foto: "https://placehold.co/150x150/2E7D32/FFFFFF?text=Limpieza",
        fechaInicio: getFormattedDate(7), // Comienza en 7 días
        fechaLimite: getFormattedDate(28), // Termina en 28 días
      },
    ];

    retosEjemplo.forEach((reto) => {
      const categoriaId = categoriaMap[reto.categoriaNombre];

      console.log(
        `Procesando reto '${reto.nombre}'. Categoría buscada: '${
          reto.categoriaNombre
        }', ID obtenida: ${categoriaId} (Tipo: ${typeof categoriaId})`
      );

      const idToInsert =
        typeof categoriaId === "number" && !isNaN(categoriaId)
          ? categoriaId
          : null;

      if (idToInsert !== null) {
        dbInstance.runSync(
          `INSERT INTO retos (nombre, descripcion, categoriaId, puntaje, latitud, longitud, radio, foto, fechaInicio, fechaLimite)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            reto.nombre,
            reto.descripcion,
            idToInsert,
            reto.puntaje,
            reto.latitud,
            reto.longitud,
            reto.radio,
            reto.foto,
            reto.fechaInicio,
            reto.fechaLimite,
          ]
        );
        console.log(
          `Reto '${reto.nombre}' INSERTADO con categoriaId: ${idToInsert}, fechaInicio: ${reto.fechaInicio}, fechaLimite: ${reto.fechaLimite}.`
        );
      } else {
        console.warn(
          `NO SE INSERTÓ RETO: Categoría '${reto.categoriaNombre}' no encontrada o ID inválido (${categoriaId}) para el reto '${reto.nombre}'.`
        );
      }
    });
    console.log("Retos de ejemplo precargados.");
    console.log("DEBUG PRELOAD RETOS FIN");
  } catch (error) {
    console.error("Error al precargar retos:", error);
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
