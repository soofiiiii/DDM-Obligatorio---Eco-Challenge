import { getDatabase } from "../database/db";
import { insertUser } from "./userService";
import { insertCategoria } from "./categoriaService";
import { insertReto } from "./retoService";
import { insertParticipacion } from "./participacionService";
import { insertMaterial } from "./materialService";
import { MARCOS_DISPONIBLES } from "../utils/marcos";

export const insertarDatosPrueba = async () => {
  try {
    // CATEGORÍAS
    const categorias = [
      "Plástico",
      "Vidrio",
      "Papel",
      "Orgánico",
      "Electrónicos",
    ];
    for (const nombre of categorias) {
      await insertCategoria(nombre.trim());
    }

    // MATERIALES
    const materiales = [
      { nombre: "Botella PET", categoria: "Plástico" },
      { nombre: "Bolsa plástica", categoria: "Plástico" },
      { nombre: "Frasco", categoria: "Vidrio" },
      { nombre: "Botella de vidrio", categoria: "Vidrio" },
      { nombre: "Diario", categoria: "Papel" },
      { nombre: "Cartón", categoria: "Papel" },
      { nombre: "Cáscara", categoria: "Orgánico" },
      { nombre: "Comida", categoria: "Orgánico" },
      { nombre: "Batería", categoria: "Electrónicos" },
      { nombre: "Cable USB", categoria: "Electrónicos" },
    ];
    for (const m of materiales) {
      await insertMaterial({
        nombre: m.nombre,
        categoria: m.categoria,
        imagen: `https://placehold.co/60x60?text=${encodeURIComponent(
          m.nombre
        )}`,
      });
    }

    // USUARIOS
    const usuarios = [
      {
        nombre: "Lucía Pérez",
        email: "lucia@ejemplo.com",
        edad: 23,
        barrio: "Centro",
        foto: "lucia.jpg",
      },
      {
        nombre: "Tomás García",
        email: "tomas@ejemplo.com",
        edad: 29,
        barrio: "Cordón",
        foto: "tomas.jpg",
      },
      {
        nombre: "Ana Díaz",
        email: "ana@ejemplo.com",
        edad: 31,
        barrio: "Malvín",
        foto: "ana.jpg",
      },
      {
        nombre: "Carlos Gómez",
        email: "carlos@ejemplo.com",
        edad: 35,
        barrio: "Pocitos",
        foto: "carlos.jpg",
      },
      {
        nombre: "Sofía Rodríguez",
        email: "sofia@ejemplo.com",
        edad: 28,
        barrio: "Ciudad Vieja",
        foto: "sofia.jpg",
      },
      {
        nombre: "Juan Fernández",
        email: "juan@ejemplo.com",
        edad: 22,
        barrio: "La Blanqueada",
        foto: "juan.jpg",
      },
      {
        nombre: "Rosa López",
        email: "rosa@ejemplo.com",
        edad: 26,
        barrio: "Parque Rodó",
        foto: "rosa.jpg",
      },
      {
        nombre: "Pedro Silva",
        email: "pedro@ejemplo.com",
        edad: 34,
        barrio: "Tres Cruces",
        foto: "pedro.jpg",
      },
      {
        nombre: "Valentina Núñez",
        email: "valen@ejemplo.com",
        edad: 19,
        barrio: "Centro",
        foto: "valen.jpg",
      },
      {
        nombre: "Luis Cabrera",
        email: "luis@ejemplo.com",
        edad: 40,
        barrio: "Malvín Norte",
        foto: "luis.jpg",
      },
    ];

    for (const u of usuarios) {
      await insertUser(u.nombre, u.email, u.edad, u.barrio, u.foto);
    }

    // RETOS
    const db = getDatabase();
    const retos = [
      {
        nombre: "Recicla 3 botellas",
        descripcion: "Botellas PET",
        categoria: "Plástico",
        fechaLimite: "2025-07-31",
        puntaje: 20,
        latitud: -34.905,
        longitud: -56.186,
        departamento: "Montevideo",
      },
      {
        nombre: "Recolecta vidrio",
        descripcion: "Frascos y botellas",
        categoria: "Vidrio",
        fechaLimite: "2025-08-15",
        puntaje: 15,
        latitud: -34.911,
        longitud: -56.164,
        departamento: "Canelones",
      },
      {
        nombre: "Reutiliza hojas",
        descripcion: "Hacer anotaciones en hojas usadas",
        categoria: "Papel",
        fechaLimite: "2025-07-25",
        puntaje: 10,
        latitud: -34.879,
        longitud: -56.143,
        departamento: "Florida",
      },
      {
        nombre: "Composta residuos",
        descripcion: "Separar restos orgánicos",
        categoria: "Orgánico",
        fechaLimite: "2025-07-20",
        puntaje: 25,
        latitud: -34.89,
        longitud: -56.203,
        departamento: "Colonia",
      },
      {
        nombre: "Recicla electrónicos",
        descripcion: "Lleva baterías a un punto verde",
        categoria: "Electrónicos",
        fechaLimite: "2025-08-05",
        puntaje: 30,
        latitud: -34.883,
        longitud: -56.151,
        departamento: "Montevideo",
      },
    ];

    const idRetosMap = {}; // nombre del reto → ID real insertado

    for (const r of retos) {
      const categoriaId = db.getFirstSync(
        "SELECT id FROM categorias WHERE nombre = ?;",
        [r.categoria]
      )?.id;

      if (!categoriaId) {
        console.warn(`No se encontró la categoría '${r.categoria}'`);
        continue;
      }

      const idInsertado = await insertReto({
        ...r,
        categoriaId,
        radio: 50,
        direccion: "Calle Ficticia 123",
        departamento: r.departamento,
        foto: "foto_reto.jpg",
        fechaInicio: "2025-07-01",
      });

      idRetosMap[r.nombre] = idInsertado;
    }

    // PARTICIPACIONES con nombre de reto en lugar de ID fijo
    const participaciones = [
      {
        nombreReto: "Recicla 3 botellas",
        email: "lucia@ejemplo.com",
        estado: "Pendiente",
      },
      {
        nombreReto: "Recolecta vidrio",
        email: "lucia@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Reutiliza hojas",
        email: "lucia@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Recicla electrónicos",
        email: "tomas@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Composta residuos",
        email: "ana@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Recolecta vidrio",
        email: "carlos@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Reutiliza hojas",
        email: "sofia@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Recicla electrónicos",
        email: "juan@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Recicla 3 botellas",
        email: "rosa@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Composta residuos",
        email: "pedro@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Recicla 3 botellas",
        email: "valen@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Recolecta vidrio",
        email: "luis@ejemplo.com",
        estado: "Aprobado",
      },
      {
        nombreReto: "Reutiliza hojas",
        email: "luis@ejemplo.com",
        estado: "Aprobado",
      },
    ];

    for (const [index, p] of participaciones.entries()) {
      const idReto = idRetosMap[p.nombreReto];
      if (!idReto) {
        console.warn(`No se encontró el reto '${p.nombreReto}'`);
        continue;
      }

      const reto = retos.find((r) => r.nombre === p.nombreReto);
      if (!reto) {
        console.warn(`No se encontró el objeto reto '${p.nombreReto}'`);
        continue;
      }

      // Generar coordenadas cercanas dentro del radio
      const delta = 0.0003; // Aproximadamente 33 metros
      const lat = reto.latitud + (Math.random() - 0.5) * delta;
      const lon = reto.longitud + (Math.random() - 0.5) * delta;
      const comentario = `Comentario ${index + 1}`;

      await insertParticipacion({
        idReto,
        emailUsuario: p.email,
        fotos: [`https://placehold.co/300x300?text=Foto+${index + 1}`],
        latitud: lat,
        longitud: lon,
        comentario,
        estado: p.estado, // debe seguir siendo "Aprobado"
      });
    }

    //  DATOS DE PRUEBA PARA USUARIO ESPECÍFICO: lauta@gmail.com
    const emailLauta = "lauta@gmail.com";

    // Insertar usuario si no existe aún
    await insertUser("Lautaro Test", emailLauta, 20, "Centro", "lauta.jpg");

    // Crear dos retos adicionales exclusivos
    const retosLauta = [
      {
        nombre: "Prueba Verde",
        descripcion: "Fotos con elementos reciclables verdes",
        categoria: "Plástico",
        fechaInicio: "2025-06-29", // hoy
        fechaLimite: "2025-07-14", // dentro de 15 días
        puntaje: 12,
        latitud: -34.9,
        longitud: -56.18,
        radio: 50,
        direccion: "Av. Prueba 123",
        departamento: "Montevideo",
        foto: "prueba_verde.jpg",
      },
      {
        nombre: "Reto Extra",
        descripcion: "Reto extra para testeo",
        categoria: "Papel",
        fechaInicio: "2025-06-29",
        fechaLimite: "2025-07-14",
        puntaje: 18,
        latitud: -34.91,
        longitud: -56.17,
        radio: 60,
        direccion: "Calle Inventada 456",
        departamento: "Montevideo",
        foto: "reto_extra.jpg",
      },
    ];

    for (const reto of retosLauta) {
      const categoriaId = db.getFirstSync(
        "SELECT id FROM categorias WHERE nombre = ?;",
        [reto.categoria]
      )?.id;
      if (categoriaId) {
        const id = await insertReto({ ...reto, categoriaId });
        await insertParticipacion({
          idReto: id,
          emailUsuario: emailLauta,
          fotos: [
            `https://placehold.co/300x300/00FF00/000000?text=${encodeURIComponent(
              reto.nombre
            )}`,
          ],
          latitud: reto.latitud,
          longitud: reto.longitud,
          comentario: `Participación en ${reto.nombre}`,
          estado: "Aprobado",
        });
      }
    }

    // Agregar marcos y posibles notificaciones si es necesario
    MARCOS_DISPONIBLES.forEach((marco) => {
      db.runSync(
        `INSERT OR IGNORE INTO marcos_usuario (emailUsuario, idMarco) VALUES (?, ?);`,
        [emailLauta, marco.id]
      );
    });

    console.log("Datos de prueba para 'lauta@gmail.com' agregados.");

    console.log("Datos de prueba insertados correctamente.");
  } catch (error) {
    console.error("Error al insertar datos de prueba:", error);
  }
};
