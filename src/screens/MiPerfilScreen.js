import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styles from '../estilos/MiPerfilScreenStyles'; // Importa los estilos desde un archivo externo
import * as Constantes from '../utils/constantes';

const MiPerfilScreen = () => {
  const ip = Constantes.IP;

  // Estados para los datos del perfil
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(true);

  // Referencias para los TextInput
  const nombreRef = useRef(null);
  const usernameRef = useRef(null);
  const correoRef = useRef(null);
  const direccionRef = useRef(null);

  // Estados para los valores originales
  const nombreOriginal = useRef('');
  const usernameOriginal = useRef('');
  const correoOriginal = useRef('');
  const direccionOriginal = useRef('');

  // Función para obtener y mostrar el perfil del usuario
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${ip}/fontechpriv/api/services/public/cliente.php?action=readProfile`);
      const data = await response.json();

      if (data.status) {
        setNombre(data.dataset.nombre);
        nombreOriginal.current = data.dataset.nombre;
        setUsername(data.dataset.usuario);
        usernameOriginal.current = data.dataset.usuario;
        setCorreo(data.dataset.correo);
        correoOriginal.current = data.dataset.correo;
        setDireccion(data.dataset.direccion);
        direccionOriginal.current = data.dataset.direccion;
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al obtener el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la actualización de los datos del perfil
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('correo', correo);
      formData.append('username', username);

      const url = `${ip}/fontechpriv/api/services/public/cliente.php?action=editProfile`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        Alert.alert('Perfil actualizado', 'Los datos del perfil han sido actualizados exitosamente');
        // Actualizar valores originales después de la actualización exitosa
        nombreOriginal.current = nombre;
        usernameOriginal.current = username;
        correoOriginal.current = correo;
        direccionOriginal.current = direccion;
      } else {
        Alert.alert('Error', 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar el perfil');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título de la sección */}
      <Text style={styles.title}>Datos Personales</Text>

      {/* Contenedor para la imagen de perfil */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: 'https://i.pinimg.com/236x/2f/97/f0/2f97f05b32547f54ef1bdf99cd207c90.jpg' }}
          style={styles.profileImage}
        />
      </View>

      {/* Contenedor para el campo Nombre */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          ref={nombreRef} // Referencia para este campo
          style={styles.input}
          onChangeText={setNombre}
          value={nombre}
        />
      </View>

      {/* Contenedor para el campo Usuario */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          ref={usernameRef} // Referencia para este campo
          style={styles.input}
          onChangeText={setUsername}
          value={username}
        />
      </View>

      {/* Contenedor para el campo Correo */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          ref={correoRef} // Referencia para este campo
          style={styles.input}
          onChangeText={setCorreo}
          value={correo}
        />
      </View>

      {/* Contenedor para el campo Dirección */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          ref={direccionRef} // Referencia para este campo
          style={styles.input}
          onChangeText={setDireccion}
          value={direccion}
        />
      </View>

      {/* Contenedor para los botones de acción */}
      <View style={styles.buttonContainer}>
        {/* Botón de Actualizar */}
        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleUpdate}>
          <Text style={[styles.buttonText, styles.updateButtonText]}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MiPerfilScreen;