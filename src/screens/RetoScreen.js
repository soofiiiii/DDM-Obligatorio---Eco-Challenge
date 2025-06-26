import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCategorias } from '../services/categoriaService';
import { insertReto } from '../services/retoService';

import { geocodeAddress } from '../services/geocodingService';

const COUNTRIES = [
  { label: "Selecciona un país...", value: null },
  { label: "Uruguay", value: "Uruguay" },
  { label: "Argentina", value: "Argentina" },
  { label: "Brasil", value: "Brasil" },
];

const CITIES_BY_COUNTRY = {
  "Uruguay": [
    { label: "Selecciona una ciudad...", value: null },
    { label: "Montevideo", value: "Montevideo" },
    { label: "Paysandú", value: "Paysandú" },
    { label: "Salto", value: "Salto" },
  ],
  "Argentina": [
    { label: "Selecciona una ciudad...", value: null },
    { label: "Buenos Aires", value: "Buenos Aires" },
    { label: "Córdoba", value: "Córdoba" },
  ],
  "Brasil": [
    { label: "Selecciona una ciudad...", value: null },
    { label: "Rio de Janeiro", value: "Rio de Janeiro" },
    { label: "Sao Paulo", value: "Sao Paulo" },
  ],
};


export default function RetoScreen() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaLimite, setFechaLimite] = useState(null);
  const [mostrarPickerInicio, setMostrarPickerInicio] = useState(false);
  const [mostrarPickerLimite, setMostrarPickerLimite] = useState(false);
  const [puntaje, setPuntaje] = useState('');
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  
  const [pais, setPais] = useState(null);
  const [ciudad, setCiudad] = useState(null);
  const [direccion, setDireccion] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [radio, setRadio] = useState('');

  useEffect(() => {
    const cargarCategorias = async () => {
      const lista = await getCategorias();
      setCategoriasDisponibles(lista);
    };
    cargarCategorias();
  }, []);

  useEffect(() => {
    const performGeocoding = async () => {
      if (pais && ciudad && direccion.trim()) {
        setIsGeocoding(true);
        const fullAddress = `${direccion}, ${ciudad}, ${pais}`;
        console.log('Geocodificando:', fullAddress);
        const coords = await geocodeAddress(fullAddress);
        if (coords) {
          setLatitud(coords.latitude);
          setLongitud(coords.longitude);
          console.log('Coordenadas obtenidas:', coords.latitude, coords.longitude);
        } else {
          setLatitud(null);
          setLongitud(null);
          Alert.alert('Error de Ubicación', 'No se pudieron encontrar las coordenadas para la dirección proporcionada. Intenta ser más específico.');
        }
        setIsGeocoding(false);
      } else {
        setLatitud(null);
        setLongitud(null);
      }
    };
    const handler = setTimeout(() => {
      performGeocoding();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [pais, ciudad, direccion]);


  const guardarReto = async () => {
    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      !categoria ||
      !fechaInicio ||
      !fechaLimite ||
      !puntaje ||
      !pais ||
      !ciudad ||
      !direccion.trim()
    ) {
      Alert.alert('Error', 'Todos los campos obligatorios deben estar completos.');
      return;
    }

    if (radio.trim() && (!latitud || !longitud)) {
        Alert.alert('Error', 'Si se especifica un radio, la dirección debe ser válida para obtener latitud y longitud.');
        return;
    }
    if (isGeocoding) {
        Alert.alert('Advertencia', 'Por favor, espera a que se termine de procesar la ubicación.');
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    const puntajeNum = parseInt(puntaje);

    if (isNaN(puntajeNum) || puntajeNum <= 0) {
      Alert.alert('Error', 'El puntaje debe ser un número positivo.');
      return;
    }

    if (fechaInicio < hoy) {
        Alert.alert('Error', 'La fecha de inicio no puede ser anterior a hoy.');
        return;
    }

    if (fechaLimite < fechaInicio) {
      Alert.alert('Error', 'La fecha límite debe ser igual o posterior a la fecha de inicio.');
      return;
    }

    const rad = radio.trim() ? parseFloat(radio) : null;
    if (radio && (isNaN(rad) || rad <= 0)) {
      Alert.alert('Error', 'El radio debe ser un número positivo.');
      return;
    }
    
    const reto = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoriaId: parseInt(categoria), // Usar categoriaId para coincidir con la DB
      fechaInicio: fechaInicio.toISOString().split('T')[0], // Formato YYYY-MM-DD
      fechaLimite: fechaLimite.toISOString().split('T')[0], // Formato YYYY-MM-DD
      puntaje: puntajeNum,
      latitud: latitud, // Ya son números desde el geocodingService
      longitud: longitud,
      radio: rad,
      foto: 'https://placehold.co/150x150/CCCCCC/000000?text=Reto', // Foto por defecto
    };

    const exito = await insertReto(reto);
    if (exito) {
      Alert.alert('Éxito', 'Reto creado.');
      setNombre('');
      setDescripcion('');
      setCategoria(null);
      setFechaInicio(null);
      setFechaLimite(null);
      setPuntaje('');
      setPais(null);
      setCiudad(null);
      setDireccion('');
      setLatitud(null);
      setLongitud(null);
      setRadio('');
    } else {
      Alert.alert('Error', 'No se pudo guardar el reto.');
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Alta de Reto</Text>

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
              ? fechaInicio.toISOString().split('T')[0]
              : 'Seleccionar fecha de inicio'
          }
          onPress={() => setMostrarPickerInicio(true)}
          color="#1e90ff"
        />
        {mostrarPickerInicio && (
          <DateTimePicker
            value={fechaInicio || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
              ? fechaLimite.toISOString().split('T')[0]
              : 'Seleccionar fecha de fin'
          }
          onPress={() => setMostrarPickerLimite(true)}
          color="#1e90ff"
        />
        {mostrarPickerLimite && (
          <DateTimePicker
            value={fechaLimite || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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

        <Text style={styles.sectionTitle}>Ubicación del Reto (Opcional si no se especifica Radio)</Text>

        <Text style={styles.label}>País:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pais}
            onValueChange={(itemValue) => {
              setPais(itemValue);
              setCiudad(null);
            }}
          >
            {COUNTRIES.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Ciudad:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={ciudad}
            onValueChange={(itemValue) => setCiudad(itemValue)}
            enabled={!!pais}
          >
            {CITIES_BY_COUNTRY[pais] ? (
              CITIES_BY_COUNTRY[pais].map((item, index) => (
                <Picker.Item key={index} label={item.label} value={item.value} />
              ))
            ) : (
              <Picker.Item label="Selecciona una ciudad..." value={null} />
            )}
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
        {isGeocoding && <ActivityIndicator size="small" color="#0000ff" style={{ marginBottom: 10 }} />}

        <TextInput
          style={styles.input}
          placeholder="Radio permitido (en metros, opcional)"
          keyboardType="numeric"
          value={radio}
          onChangeText={setRadio}
        />

        <View style={{ marginTop: 20, marginBottom: 50 }}>
          <Button title="Crear reto" onPress={guardarReto} color="#28a745" /> 
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center',
    paddingBottom: 50,
  },
  title: { 
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25, 
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom: 15,
      textAlign: 'center',
      color: '#444',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 10,
  },
  coordsText: {
      fontSize: 14,
      color: '#888',
      textAlign: 'center',
      marginTop: 5,
      marginBottom: 15,
  }
});
