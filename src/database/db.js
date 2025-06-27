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