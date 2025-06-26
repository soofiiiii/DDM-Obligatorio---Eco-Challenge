import * as SQLite from "expo-sqlite";

let db = null; 

export function getDatabase() {
  if (!db) {
    try {
      db = SQLite.openDatabaseSync("ecochallenge.db");
      console.log("Database opened synchronously: ecochallenge.db");
    } catch (error) {
      console.error("Error al abrir la base de datos:", error);
      throw error;
    }
  }
  return db;
}

export const initDB = () => {
  const dbInstance = getDatabase(); // Obtener la instancia de DB
  try {
    dbInstance.execSync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT UNIQUE,
        edad INTEGER,
        barrio TEXT,
        foto TEXT,
        rol TEXT DEFAULT 'usuario',
        contrasena TEXT,
        puntos INTEGER DEFAULT 0 
      );

      CREATE TABLE IF NOT EXISTS sesion (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        usuario TEXT
      );
    `);

    // Insertar usuario admin si no existe
    const adminExiste = dbInstance.getFirstSync(
      `SELECT 1 AS existe FROM usuarios WHERE email = 'admin@eco.com' LIMIT 1;`
    );

    if (!adminExiste) {
      dbInstance.runSync(
        `INSERT INTO usuarios (nombre, email, edad, barrio, foto, rol, contrasena, puntos)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        ["Admin", "admin@eco.com", 99, "Centro", "", "admin", "admin123", 0]
      );
      console.log("Usuario admin insertado por defecto.");
    }

    // Actualizar usuarios existentes si no tienen la columna 'puntos' 
    try {
      dbInstance.execSync(
        "ALTER TABLE usuarios ADD COLUMN puntos INTEGER DEFAULT 0;"
      );
      console.log(
        "Columna 'puntos' añadida a la tabla 'usuarios' (si no existía)."
      );
    } catch (e) {
      if (!e.message.includes("duplicate column name: puntos")) {
        console.warn("Advertencia al intentar añadir columna 'puntos':", e);
      }
    }

    console.log("Tablas de usuarios y sesión inicializadas o ya existentes.");
  } catch (error) {
    console.error("Error al inicializar la base de datos (initDB):", error);
    throw error;
  }
};

export const getAllUsers = () => {
  const dbInstance = getDatabase();
  try {
    const rows = dbInstance.getAllSync("SELECT *, puntos FROM usuarios;");
    return rows;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const emailExists = (email) => {
  const dbInstance = getDatabase();
  try {
    const row = dbInstance.getFirstSync(
      "SELECT 1 FROM usuarios WHERE email = ? LIMIT 1;",
      [email]
    );
    return row !== null;
  } catch (error) {
    console.error("Error al verificar email:", error);
    throw error;
  }
};

export const insertUser = (usuario) => {
  const dbInstance = getDatabase();
  const {
    nombre,
    email,
    edad,
    barrio,
    foto,
    rol = "usuario",
    contrasena,
    puntos = 0,
  } = usuario;

  try {
    const result = dbInstance.runSync(
      "INSERT INTO usuarios (nombre, email, edad, barrio, foto, rol, contrasena, puntos) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
      [nombre, email, edad, barrio, foto, rol, contrasena, puntos]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error al insertar usuario:", error);
    throw error;
  }
};

export const clearUsers = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync("DELETE FROM usuarios;");
  } catch (error) {
    console.error("Error al limpiar usuarios:", error);
    throw error;
  }
};

export const updateUserPuntos = (email, nuevosPuntos) => {
  const dbInstance = getDatabase();
  try {
    const result = dbInstance.runSync(
      `UPDATE usuarios SET puntos = ? WHERE email = ?;`,
      [nuevosPuntos, email]
    );
    console.log(
      `Puntos de ${email} actualizados a ${nuevosPuntos}. Cambios: ${result.changes}`
    );
    return result.changes > 0;
  } catch (error) {
    console.error(`Error al actualizar puntos para ${email}:`, error);
    throw error;
  }
};

export const guardarSesion = (usuario) => {
  const dbInstance = getDatabase();
  try {
    const userToSave = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      edad: usuario.edad,
      barrio: usuario.barrio,
      foto: usuario.foto,
      rol: usuario.rol,
      puntos: usuario.puntos || 0,
    };
    const userStr = JSON.stringify(userToSave);
    dbInstance.execSync("DELETE FROM sesion;");
    dbInstance.runSync(
      "INSERT OR REPLACE INTO sesion (id, usuario) VALUES (1, ?);",
      [userStr]
    );
  } catch (error) {
    console.error("Error al guardar sesión:", error);
    throw error;
  }
};

export const obtenerSesion = () => {
  const dbInstance = getDatabase();
  try {
    const row = dbInstance.getFirstSync(
      "SELECT usuario FROM sesion WHERE id = 1;"
    );
    if (row) {
      let usuario = JSON.parse(row.usuario);
      // Asegurarse de que los puntos se carguen correctamente si no están en la sesión
      if (usuario && (typeof usuario.puntos === "undefined" || usuario.puntos === null) && usuario.email) {
        const fullUser = dbInstance.getFirstSync(
          "SELECT puntos FROM usuarios WHERE email = ? LIMIT 1;",
          [usuario.email]
        );
        if (fullUser) {
          usuario.puntos = fullUser.puntos;
        } else {
          usuario.puntos = 0;
        }
      }
      return usuario;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener sesión:", error);
    throw error;
  }
};

export const cerrarSesion = () => {
  const dbInstance = getDatabase();
  try {
    dbInstance.execSync("DELETE FROM sesion;");
    console.log("Sesión eliminada de la base de datos.");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

export const actualizarFotoUsuario = (email, nuevaFoto) => {
  const dbInstance = getDatabase();
  try {
    dbInstance.runSync("UPDATE usuarios SET foto = ? WHERE email = ?;", [
      nuevaFoto,
      email,
    ]);
  } catch (error) {
    console.error("Error al actualizar foto del usuario:", error);
    throw error;
  }
};

export const loginUsuario = (email, contrasena) => {
  const dbInstance = getDatabase();
  try {
    const row = dbInstance.getFirstSync(
      "SELECT *, puntos FROM usuarios WHERE email = ? AND contrasena = ? LIMIT 1;",
      [email, contrasena]
    );
    return row || null;
  } catch (error) {
    console.error("Error al intentar login:", error);
    throw error;
  }
};

export const actualizarUsuario = (usuario) => {
  const db = getDatabase();
  try {
    db.runSync(
      `UPDATE usuarios SET nombre = ?, edad = ?, barrio = ?, foto = ? WHERE email = ?`,
      [usuario.nombre, usuario.edad, usuario.barrio, usuario.foto, usuario.email]
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return false;
  }
};

export const eliminarUsuario = (email) => {
  const db = getDatabase();
  try {
    db.runSync(`DELETE FROM usuarios WHERE email = ?`, [email]);
    db.runSync(`DELETE FROM sesion WHERE usuario = ?`, [email]);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  }
};
