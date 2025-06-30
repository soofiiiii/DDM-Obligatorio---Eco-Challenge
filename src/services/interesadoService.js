import { getDatabase } from "../database/db";
import * as Notifications from "expo-notifications";
import { insertarNotificacion } from "./notificacionService";

// Inicializa la tabla 'interesados' si no existe.
export const initInteresados = () => {
  const db = getDatabase();
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS interesados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emailUsuario TEXT,
        idReto INTEGER,
        UNIQUE(emailUsuario, idReto)
      );
    `);
  } catch (error) {
    console.error("Error al crear tabla interesados:", error);
  }
};

// Verifica si un reto ya está marcado como interesante por un usuario.
export const estaMarcado = (email, idReto) => {
  const db = getDatabase();
  try {
    const row = db.getFirstSync(
      `SELECT 1 FROM interesados WHERE emailUsuario = ? AND idReto = ? LIMIT 1;`,
      [email, idReto]
    );
    return !!row;
  } catch (error) {
    console.error("Error al verificar si ya está marcado:", error);
    return false;
  }
};

// Marca un reto como "me interesa" y programa las notificaciones.
export const marcarComoInteresado = async (email, reto) => {
  const db = getDatabase();
  try {
    if (estaMarcado(email, reto.id)) {
      return false;
    }

    db.runSync(
      `INSERT INTO interesados (emailUsuario, idReto) VALUES (?, ?);`,
      [email, reto.id]
    );
   
    await programarNotificacionesDelReto(reto);
    return true;
  } catch (error) {
    console.error("Error al marcar como interesado:", error);
    return false;
  }
};

// Devuelve una lista de todos los retos que un usuario marcó como interesantes.
export const getRetosInteresados = (email) => {
  const db = getDatabase();
  try {
    const rows = db.getAllSync(
      `SELECT r.*
       FROM retos r
       JOIN interesados i ON r.id = i.idReto
       WHERE i.emailUsuario = ?;`,
      [email]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener retos interesados:", error);
    return [];
  }
};

// Programa notificaciones locales para el inicio y la fecha límite de un reto.
export const programarNotificacionesDelReto = async (reto) => {
  try {
    const now = new Date(); // Hora y fecha actual
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Inicio del día de hoy

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Inicio del día de mañana

    // Notificación de INICIO (si empieza mañana)
    if (reto.fechaInicio) {
      const inicio = new Date(reto.fechaInicio);
      const inicioSoloFecha = new Date(reto.fechaInicio);
      inicioSoloFecha.setHours(0, 0, 0, 0);

      // Si el reto comienza mañana o en el futuro
      if (inicioSoloFecha.getTime() === tomorrow.getTime()) {
        const fechaNotif = new Date(tomorrow);
        fechaNotif.setHours(9, 0, 0, 0);

        // Comienza mañana
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "EcoChallenge",
            body: `¡El reto "${reto.nombre}" comienza mañana! Prepárate.`,
          },
          trigger: {
            type: "date",
            date: new Date(tomorrow.setHours(9, 0, 0)), // Ejemplo: Mañana a las 9 AM
          },
        });

        insertarNotificacion(
          reto.id,
          "EcoChallenge",
          `¡El reto "${reto.nombre}" comienza mañana! Prepárate.`,
          fechaNotif
        );
      }
    } else if (inicioSoloFecha > tomorrow) {
      // Si el inicio es más allá de mañana, se programa para el día del inicio.
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "EcoChallenge",
          body: `¡Hoy comienza el reto: "${reto.nombre}"!`,
        },
        trigger: {
          type: "date",
          date: inicio, // Usa la fecha y hora original de inicio para el trigger
        },
      });

      insertarNotificacion(
        reto.id,
        "EcoChallenge",
        `¡Hoy comienza el reto: "${reto.nombre}"!`,
        fechaNotif
      );
    }

    // Notificaciones de FECHA LÍMITE (si termina hoy o mañana)
    if (reto.fechaLimite) {
      const fin = new Date(reto.fechaLimite);
      const finSoloFecha = new Date(reto.fechaLimite);
      finSoloFecha.setHours(0, 0, 0, 0);

      // Notificación si el reto termina HOY (y aún no ha pasado la hora)
      if (finSoloFecha.getTime() === today.getTime() && fin > now) {
        const fechaNotif = new Date(fin);
        fechaNotif.setHours(9, 0, 0, 0);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "EcoChallenge",
            body: `¡Último día para completar el reto: "${reto.nombre}"!`,
          },
          trigger: {
            type: "date",
            date: fin, // Se dispara a la hora de fin real
          },
        });

        insertarNotificacion(
          reto.id,
          "EcoChallenge",
          `¡Último día para completar el reto: "${reto.nombre}"!`,
          fechaNotif
        );
      }

      // Notificación si el reto termina MAÑANA
      else if (finSoloFecha.getTime() === tomorrow.getTime()) {
        const fechaNotif = new Date(tomorrow);
        fechaNotif.setHours(9, 0, 0, 0);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "EcoChallenge",
            body: `¡Atención! El reto "${reto.nombre}" termina mañana. ¡No lo dejes para última hora!`,
          },
          trigger: {
            type: "date",
            date: new Date(tomorrow.setHours(9, 0, 0)), // Ejemplo: Mañana a las 9 AM
          },
        });

        insertarNotificacion(
          reto.id,
          "EcoChallenge",
          `¡Atención! El reto "${reto.nombre}" termina mañana. ¡No lo dejes para última hora!`,
          fechaNotif
        );
      }

      // Notificación si el reto termina en el futuro (más allá de mañana)
      else if (finSoloFecha > tomorrow) {
        const fechaNotif = new Date(fin);
        fechaNotif.setHours(9, 0, 0, 0);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "EcoChallenge",
            body: `¡Último día para completar el reto: "${reto.nombre}"!`,
          },
          trigger: {
            type: "date",
            date: fin, // Se dispara a la hora de fin real
          },
        });

        insertarNotificacion(
          reto.id,
          "EcoChallenge",
          `¡Último día para completar el reto: "${reto.nombre}"!`,
          fechaNotif
        );
      }
    }
  } catch (error) {
    console.error("Error al programar notificaciones del reto:", error);
  }
};
