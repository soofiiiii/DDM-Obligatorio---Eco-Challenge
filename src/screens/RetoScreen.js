import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getCategorias } from "../services/categoriaService";
import { insertReto, updateReto } from "../services/retoService";

import { geocodeAddress } from "../services/geocodingService";

import { obtenerDepartamentosDeUruguay } from "../utils/ubicacion";

export default function RetoScreen() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaLimite, setFechaLimite] = useState(null);
  const [mostrarPickerInicio, setMostrarPickerInicio] = useState(false);
  const [mostrarPickerLimite, setMostrarPickerLimite] = useState(false);
  const [puntaje, setPuntaje] = useState("");
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  const [departamento, setDepartamento] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);

  const [direccion, setDireccion] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [radio, setRadio] = useState("");

  const route = useRoute();
  const navigation = useNavigation();
  const retoEdit = route.params?.retoEdit || null;

  //Carga las categorías disponibles
  useEffect(() => {
    const cargarCategorias = async () => {
      const lista = await getCategorias();
      setCategoriasDisponibles(lista);
    };
    cargarCategorias();
  }, []);

  //Carga los departamentos de Uruguay
  useEffect(() => {
    setDepartamentos(obtenerDepartamentosDeUruguay());
  }, []);

  // Efecto para precargar los datos del reto cuando se está editando
  useEffect(() => {
    if (retoEdit && departamentos.length > 0) {

      console.log("DEBUG: retoEdit.departamento:", retoEdit.departamento, "(Tipo:", typeof retoEdit.departamento + ")");
      console.log("DEBUG: retoEdit.direccion:", retoEdit.direccion, "(Tipo:", typeof retoEdit.direccion + ")");
      
      setNombre(retoEdit.nombre);
      setDescripcion(retoEdit.descripcion);
      // Aseguramos que categoriaId sea un número entero para el Piker
      setCategoria(retoEdit.categoriaId);
      setFechaInicio(new Date(retoEdit.fechaInicio));
      setFechaLimite(new Date(retoEdit.fechaLimite));
      setPuntaje(retoEdit.puntaje.toString());
      setLatitud(retoEdit.latitud);
      setLongitud(retoEdit.longitud);
      setRadio(retoEdit.radio?.toString() || "");

      // Para el departamento, buscamos el valor que coincide en nuestra lista
      // Esto maneja si retoEdit.departamento es el 'label' o el 'value' del departamento
      const departamentToSet = departamentos.find(
        (dep) => dep.label === retoEdit.departamento || dep.value === retoEdit.departamento
      )?.value || null; // Obtener el 'value' para el Piker
      setDepartamento(departamentToSet);
      setDireccion(retoEdit.direccion || "");

      //setDepartamento(retoEdit.departamento || null);
      //setDireccion(retoEdit.direccion || "");
    }
  }, [retoEdit, departamentos]); // Añadimos las dependendencias para asegurar que los datos estén cargados al buscar
  
  
  // Efecto para realizar la geocodificación de la dirección
  useEffect(() => {
    const performGeocoding = async () => {
      // Solo geocodificamos si hay un departamento y una dirección,
      // Y si la latitud/longitud no están ya establecidad (para evitar re-geocodificar al cargar edición)
      if (departamento && direccion.trim() && (latitud === null || longitud === null || reto === null)) {
        setIsGeocoding(true);
        const fullAddress = `${direccion}, ${departamento}, Uruguay`;
        console.log("Geocodificando:", fullAddress);
        const coords = await geocodeAddress(fullAddress);
        if (coords) {
          setLatitud(coords.latitude);
          setLongitud(coords.longitude);
          console.log(
            "Coordenadas obtenidas:",
            coords.latitude,
            coords.longitude
          );
        } else {
          setLatitud(null);
          setLongitud(null);
        }
        setIsGeocoding(false);
      } else if (!departamento || !direccion.trim()) {
        // Limpiamos coordenadas si no hay dirección o departamento completos
        setLatitud(null);
        setLongitud(null);
      }
    };
    // Pequeño retraso para evitar llamadas excesivas al escribir la dirección
    const handler = setTimeout(() => {
      performGeocoding();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [departamento, direccion, latitud, longitud, retoEdit]);

  const guardarReto = async () => {
    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      categoria === null|| // '=== null' para manejar explícitamente el valor inicial
      !fechaInicio ||
      !fechaLimite ||
      !puntaje.trim() || // Aseguramos que el puntaje no sea solo espacios
      departamento === null ||
      !direccion.trim()
    ) {
      Alert.alert(
        "Error",
        "Todos los campos obligatorios deben estar completos."
      );
      return;
    }

    if (direccion.trim() && (!latitud || !longitud)) {
      Alert.alert(
        "Error",
        "No se pudo validar la dirección proporcionada. Por favor revisala."
      );
      return;
    }

    if (isGeocoding) {
      Alert.alert(
        "Advertencia",
        "Por favor, espera a que se termine de procesar la ubicación."
      );
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    const puntajeNum = parseInt(puntaje);

    if (isNaN(puntajeNum) || puntajeNum <= 0) {
      Alert.alert("Error", "El puntaje debe ser un número positivo.");
      return;
    }

    // Validar fechas solo si el reto es nuevo o si la fecha de inicio es modificada a una anterior
    // Si el reto ya existe y la fecha de inicio no ha cambiado, no frozar a que sea posterior a hoy
    if (!retoEdit && fechaInicio < hoy) {
      Alert.alert("Error", "La fecha de inicio no puede ser anterior a hoy.");
      return;
    }

    // Si se edita y la fecha es anterior a hoy, y no es la misma que ya tenía, se alerta.
    if (retoEdit && fechaInicio < hoy && fechaInicio.toISOString().split("T")[0] !== retoEdit.fechaInicio){
        Alert.alert("Error", "La fecha de inicio no puede ser anterior a hoy al modificarla.");
        return;
    } 
    
    if (fechaLimite < fechaInicio) {
      Alert.alert(
        "Error",
        "La fecha límite debe ser igual o posterior a la fecha de inicio."
      );
      return;
    }

    const rad = radio.trim() ? parseFloat(radio) : null;
    if (radio && (isNaN(rad) || rad <= 0)) {
      Alert.alert("Error", "El radio debe ser un número positivo.");
      return;
    }

    const reto = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoriaId: parseInt(categoria), // Aseguramos que sea un número
      fechaInicio: fechaInicio.toISOString().split("T")[0],
      fechaLimite: fechaLimite.toISOString().split("T")[0],
      puntaje: puntajeNum,
      departamento: departamento,
      direccion: direccion.trim(),
      latitud,
      longitud,
      radio: rad,
      foto: "https://placehold.co/150x150/CCCCCC/000000?text=Reto",
    };

    let exito = false;

    if (retoEdit) {
      exito = await updateReto(retoEdit.id, reto);
    } else {
      exito = await insertReto(reto);
    }

    if (exito) {
      Alert.alert("Éxito", retoEdit ? "Reto actualizado." : "Reto creado.");
      navigation.goBack();
    } else {
      Alert.alert("Error", "No se pudo guardar el reto.");
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{retoEdit ? "Editar Reto" : "Alta de Reto"}</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del reto"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <Text style={styles.label}>Seleccionar categoría:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoria}
            onValueChange={(itemValue) => setCategoria(itemValue)}
          >
            <Picker.Item label="Seleccioná una categoría..." value={null} />
            {categoriasDisponibles.map((item) => (
              <Picker.Item key={item.id} label={item.nombre} value={item.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Fecha de inicio:</Text>
        <Button
          title={
            fechaInicio
              ? fechaInicio.toISOString().split("T")[0]
              : "Seleccionar fecha de inicio"
          }
          onPress={() => setMostrarPickerInicio(true)}
          color="#1e90ff"
        />
        {mostrarPickerInicio && (
          <DateTimePicker
            value={fechaInicio || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setMostrarPickerInicio(false);
              if (date) setFechaInicio(date);
            }}
          />
        )}

        <Text style={styles.label}>Fecha límite:</Text>
        <Button
          title={
            fechaLimite
              ? fechaLimite.toISOString().split("T")[0]
              : "Seleccionar fecha de fin"
          }
          onPress={() => setMostrarPickerLimite(true)}
          color="#1e90ff"
        />
        {mostrarPickerLimite && (
          <DateTimePicker
            value={fechaLimite || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setMostrarPickerLimite(false);
              if (date) setFechaLimite(date);
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Puntaje"
          keyboardType="numeric"
          value={puntaje}
          onChangeText={setPuntaje}
        />

        <Text style={styles.sectionTitle}>
          Ubicación del Reto
        </Text>

        <Text style={styles.label}>Departamento:</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={departamento} onValueChange={(itemValue) => setDepartamento(itemValue)}>
            {departamentos.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Dirección (calle y número):</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Av. 18 de Julio 1234"
          value={direccion}
          onChangeText={setDireccion}
          editable={!isGeocoding}
        />
        {isGeocoding && (
          <ActivityIndicator
            size="small"
            color="#0000ff"
            style={{ marginBottom: 10 }}
          />
        )}
        
        

        <TextInput
          style={styles.input}
          placeholder="Radio permitido (en metros, opcional)"
          keyboardType="numeric"
          value={radio}
          onChangeText={setRadio}
        />

        <View style={{ marginTop: 20, marginBottom: 50 }}>
          <Button
            title={retoEdit ? "Actualizar reto" : "Crear reto"}
            onPress={guardarReto}
            color={retoEdit ? "#f39c12" : "#28a745"} // Amarillo para editar, verde para crear
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 16,
    color: "#555",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
    textAlign: "center",
    color: "#444",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  coordsText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },
});
