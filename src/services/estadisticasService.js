import { getDatabase } from "../database/db";

export const getRetosCompletadosPorZona = () => {
  const db = getDatabase();
  try {
    return db.getAllSync(`
  SELECT r.departamento AS zona, COUNT(p.id) AS cantidad
  FROM participaciones p
  JOIN retos r ON p.idReto = r.id
  WHERE p.estado = 'Aprobado'
  GROUP BY r.departamento
  ORDER BY cantidad DESC;
`);
  } catch (error) {
    console.error("Error en getRetosCompletadosPorZona:", error);
    return [];
  }
};

export const getCategoriasPorZona = () => {
  const db = getDatabase();
  try {
    return db.getAllSync(`
  SELECT r.departamento AS zona, c.nombre AS categoria, COUNT(*) AS cantidad
  FROM participaciones p
  JOIN retos r ON p.idReto = r.id
  JOIN categorias c ON r.categoriaId = c.id
  WHERE p.estado = 'Aprobado'
  GROUP BY r.departamento, c.nombre
  ORDER BY r.departamento, cantidad DESC;
`);
  } catch (error) {
    console.error("Error en getCategoriasPorZona:", error);
    return [];
  }
};
