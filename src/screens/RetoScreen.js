import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCategorias } from '../services/categoriaService';
import { insertReto } from '../services/retoService';

export default function RetoScreen() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState(null); // ahora es ID numérico
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaLimite, setFechaLimite] = useState(null);
  const [mostrarPickerInicio, setMostrarPickerInicio] = useState(false);
  const [mostrarPickerLimite, setMostrarPickerLimite] = useState(false);
  const [puntaje, setPuntaje] = useState('');
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  useEffect(() => {
    const cargarCategorias = async () => {
      const lista = await getCategorias();
      setCategoriasDisponibles(lista);
    };
    cargarCategorias();
  }, []);

  const guardarReto = async () => {
    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      !categoria ||
      !fechaInicio ||
      !fechaLimite ||
      !puntaje
    ) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (isNaN(puntaje) || parseInt(puntaje) <= 0) {
      Alert.alert('Error', 'El puntaje debe ser un número positivo.');
      return;
    }

    const reto = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoria: parseInt(categoria),
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaLimite: fechaLimite.toISOString().split('T')[0],
      puntaje: parseInt(puntaje)
    };

    const exito = await insertReto(reto);
    if (exito) {
      Alert.alert('Éxito', 'Reto creado.');
      // Limpiar campos
      setNombre('');
      setDescripcion('');
      setCategoria(null);
      setFechaInicio(null);
      setFechaLimite(null);
      setPuntaje('');
    } else {
      Alert.alert('Error', 'No se pudo guardar el reto.');
    }
  };

  return (
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

      <View style={{ marginTop: 20 }}>
        <Button title="Crear reto" onPress={guardarReto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10
  }
});
