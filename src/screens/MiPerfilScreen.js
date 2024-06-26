import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import styles from '../estilos/MiPerfilScreenStyles'; // Importa los estilos desde un archivo externo
import * as Constantes from '../utils/constantes';

const MiPerfilScreen = () => {
  const ip = Constantes.IP;

  // Estados para los datos del perfil
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  // Referencias para los TextInput
  const nombreRef = useRef(null);
  const usernameRef = useRef(null);
  const correoRef = useRef(null);
  const telefonoRef = useRef(null);
  const direccionRef = useRef(null);

  // Función para manejar la actualización de los datos del perfil
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('username', username);
      formData.append('correo', correo);
      formData.append('telefono', telefono);
      formData.append('direccion', direccion);
      
      const url = `${ip}/fontechpriv/api/services/public/cliente.php?action=updateProfile`;
      console.log('URL solicitada:', url); // Para verificar la URL

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text(); // Obtén la respuesta como texto

      try {
        const data = JSON.parse(responseText); // Intenta parsear la respuesta como JSON
        if (data.status) {
          Alert.alert('Perfil actualizado', 'Los datos del perfil han sido actualizados exitosamente');
        } else {
          Alert.alert('Error', 'No se pudo actualizar el perfil');
        }
      } catch (jsonError) {
        console.error('Error al parsear JSON:', jsonError);
        console.error('Respuesta recibida:', responseText);
        Alert.alert('Error', 'Ocurrió un error al procesar la respuesta del servidor');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar el perfil');
    }
  };

  // Función para manejar la cancelación y limpiar los campos
  const handleDelete = () => {
    // Limpiar los estados
    setNombre('');
    setUsername('');
    setCorreo('');
    setTelefono('');
    setDireccion('');

    // Limpiar los TextInput utilizando las referencias
    nombreRef.current.clear();
    usernameRef.current.clear();
    correoRef.current.clear();
    telefonoRef.current.clear();
    direccionRef.current.clear();
  };

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
          placeholder="Dickey"
          keyboardType="default"
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
          placeholder="DK123"
          keyboardType="email-address"
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
          placeholder="DK123@gmail.com"
          keyboardType="email-address"
          onChangeText={setCorreo}
          value={correo}
        />
      </View>

      {/* Contenedor para el campo Teléfono */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          ref={telefonoRef} // Referencia para este campo
          style={styles.input}
          placeholder="2250-5555"
          keyboardType="phone-pad"
          onChangeText={setTelefono}
          value={telefono}
        />
      </View>

      {/* Contenedor para el campo Dirección */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          ref={direccionRef} // Referencia para este campo
          style={styles.input}
          placeholder="Mi casita xd"
          keyboardType="default"
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

        {/* Botón de Cancelar */}
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={[styles.buttonText, styles.deleteButtonText]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MiPerfilScreen;
