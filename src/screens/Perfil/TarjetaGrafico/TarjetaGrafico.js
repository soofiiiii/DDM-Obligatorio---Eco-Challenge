import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AuthContext } from "../../../context/AuthContext";
import { getDatabase } from "../../../database/db";
import { crearStylesTarjetaGrafico } from "./styles";
import { ThemeContext } from "../../../context/ThemeContext";

const screenWidth = Dimensions.get("window").width - 40;

export default function TarjetaGrafico() {
  const [filtro, setFiltro] = useState("semana");
  const { usuario } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const styles = crearStylesTarjetaGrafico(theme);
  const [datosGrafico, setDatosGrafico] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [hasGraphError, setHasGraphError] = useState(false);

  useEffect(() => {
    if (usuario?.email) {
      cargarDatos();
    } else {
      setDatosGrafico({ labels: [], datasets: [{ data: [] }] });
      setHasGraphError(true);
    }
  }, [usuario, filtro]);

  const cargarDatos = () => {
    setHasGraphError(false);
    const db = getDatabase();

    if (!db || !usuario?.email) {
      setDatosGrafico({ labels: [], datasets: [{ data: [] }] });
      setHasGraphError(true);
      return;
    }

    if (filtro === "semana") {
      const labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      const hoy = new Date();
      const dias = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() - i);
        dias.push(d.toISOString().split("T")[0]);
      }

      const data = dias.map((fecha) => {
        try {
          const res = db.getFirstSync(
            `SELECT COUNT(*) AS total FROM participaciones WHERE emailUsuario = ? AND estado = 'Aprobado' AND DATE(fechaParticipacion) = ?`,
            [usuario.email, fecha]
          );
          let totalRaw = res?.total;
          let total = parseInt(totalRaw, 10);

          if (!Number.isFinite(total) || isNaN(total)) {
            console.warn(`Valor inválido en total: ${totalRaw}`);
            total = 0;
          }

          return total;
        } catch {
          setHasGraphError(true);
          return 0;
        }
      });

      if (data.some((v) => !Number.isFinite(v))) {
        setHasGraphError(true);
        setDatosGrafico({
          labels,
          datasets: [{ data: Array(labels.length).fill(0) }],
        });
      } else {
        if (
          Array.isArray(labels) &&
          Array.isArray(data) &&
          labels.length === data.length &&
          data.every((val) => Number.isFinite(val))
        ) {
          setDatosGrafico({ labels, datasets: [{ data }] });
        } else {
          console.warn("Datos inválidos para el gráfico. Corrigiendo...");
          setDatosGrafico({
            labels: ["1", "2", "3", "4", "5", "6", "7"],
            datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
          });
          setHasGraphError(true);
        }
      }
    }

    if (filtro === "mes") {
      const semanas = [0, 0, 0, 0];
      const labels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"];

      try {
        const resultados = db.getAllSync(
          `SELECT fechaParticipacion FROM participaciones WHERE emailUsuario = ? AND estado = 'Aprobado' AND fechaParticipacion >= date('now', '-30 days')`,
          [usuario.email]
        );

        resultados.forEach(({ fechaParticipacion }) => {
          const d = new Date(fechaParticipacion);
          if (isNaN(d.getTime())) return;
          const dia = d.getDate();

          if (dia <= 7) semanas[0]++;
          else if (dia <= 14) semanas[1]++;
          else if (dia <= 21) semanas[2]++;
          else semanas[3]++;
        });

        const allZeros = semanas.every((v) => v === 0);
        if (allZeros) {
          setDatosGrafico({ labels, datasets: [{ data: [0, 0, 0, 0] }] });
          return;
        }

        if (semanas.some((v) => !Number.isFinite(v))) {
          setHasGraphError(true);
          setDatosGrafico({
            labels,
            datasets: [{ data: Array(labels.length).fill(0) }],
          });
        } else {
          setDatosGrafico({ labels, datasets: [{ data: semanas }] });
        }
      } catch {
        setHasGraphError(true);
        setDatosGrafico({ labels, datasets: [{ data: Array(4).fill(0) }] });
      }
    }
  };

  const datosValidos =
    datosGrafico.labels.length > 0 &&
    datosGrafico.datasets.length > 0 &&
    datosGrafico.datasets[0].data.length === datosGrafico.labels.length &&
    datosGrafico.datasets[0].data.every((val) => Number.isFinite(val));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Estadísticas de Participación</Text>
        <View style={styles.filtros}>
          <TouchableOpacity
            style={[
              styles.filtroBoton,
              filtro === "semana" && styles.filtroActivo,
            ]}
            onPress={() => setFiltro("semana")}
          >
            <Text
              style={
                filtro === "semana" ? styles.textoActivo : styles.textoFiltro
              }
            >
              Semana
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filtroBoton,
              filtro === "mes" && styles.filtroActivo,
            ]}
            onPress={() => setFiltro("mes")}
          >
            <Text
              style={filtro === "mes" ? styles.textoActivo : styles.textoFiltro}
            >
              Mes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {hasGraphError || screenWidth <= 0 || !datosValidos ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#D32F2F", fontSize: 16, textAlign: "center" }}>
            {hasGraphError
              ? "No se pudieron cargar los datos del gráfico."
              : "El tamaño de pantalla es demasiado pequeño para el gráfico."}
          </Text>
        </View>
      ) : (
        <LineChart
          data={datosGrafico}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: theme.card,
            backgroundGradientFrom: theme.card,
            backgroundGradientTo: theme.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // o usar theme.primary con conversión si querés
            labelColor: () => theme.text,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: theme.primary,
            },
            yAxisFromZero: true,
          }}
          bezier
          style={styles.grafico}
        />
      )}
    </View>
  );
}
