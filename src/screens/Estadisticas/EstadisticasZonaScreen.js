import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import {
  getRetosCompletadosPorZona,
  getCategoriasPorZona,
} from "../../services/estadisticasService";

import styles from "./styles";

export default function EstadisticasZonaScreen() {
  const [porZona, setPorZona] = useState([]);
  const [categoriasZona, setCategoriasZona] = useState([]);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      const z = getRetosCompletadosPorZona();
      const c = getCategoriasPorZona();
      console.log("Retos por zona:", z);
      console.log("Categorías por zona:", c);
      setPorZona(z);
      setCategoriasZona(c);
    };

    setTimeout(cargarEstadisticas, 300); // tiempo mínimo de espera
  }, []);

  const colores = ["#4CAF50", "#8BC34A", "#CDDC39", "#FFC107", "#FF5722"];
  const chartWidth = Dimensions.get("window").width - 32;
  const chartHeight = 240;

  const pieData =
    porZona.length > 0
      ? porZona.map((item, index) => ({
          name: item.zona, 
          population: item.cantidad,
          color: colores[index % colores.length],
          legendFontColor: "#212121",
          legendFontSize: 14,
        }))
      : [
          {
            name: "Sin datos",
            population: 1,
            color: "#CCCCCC",
            legendFontColor: "#888888",
            legendFontSize: 14,
          },
        ];

  const barLabels =
    porZona.length > 0 ? porZona.map((z) => z.zona) : ["Sin datos"];
  const barValues = porZona.length > 0 ? porZona.map((z) => z.cantidad) : [0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Gráfico circular de zonas:</Text>
        <PieChart
          data={pieData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: () => "#212121",
            labelColor: () => "#212121",
            propsForLabels: { fontSize: 12 },
          }}
          accessor={"population"}
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Gráfico de barras:</Text>
        <BarChart
          data={{
            labels: barLabels,
            datasets: [{ data: barValues }],
          }}
          width={chartWidth}
          height={chartHeight}
          fromZero
          showValuesOnTopOfBars
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: () => "#388E3C",
            labelColor: () => "#212121",
            propsForLabels: { fontSize: 10 },
          }}
          verticalLabelRotation={0}
        />
      </View>

      <Text style={styles.subtitle}>Categorías recicladas por zona:</Text>
      {categoriasZona.length > 0 ? (
        categoriasZona.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item.barrio} – {item.categoria}: {item.cantidad}
          </Text>
        ))
      ) : (
        <Text style={styles.item}>Aún no se tienen datos.</Text>
      )}
    </ScrollView>
  );
}
