import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import styles from '../estilos/MiPerfilScreenStyles'; // Importa los estilos desde un archivo externo

const MiPerfilScreen = () => {
  // Estados para los datos del perfil
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');

  // Referencias para los TextInput
  const nombreRef = useRef(null);
  const usernameRef = useRef(null);
  const correoRef = useRef(null);
  const telefonoRef = useRef(null);

  // Función para manejar la actualización de los datos del perfil
  const handleUpdate = () => {
    // Aquí iría la lógica para actualizar los datos del perfil
  };

  // Función para manejar la cancelación y limpiar los campos
  const handleDelete = () => {
    // Limpiar los estados
    setNombre('');
    setUsername('');
    setCorreo('');
    setTelefono('');

    // Limpiar los TextInput utilizando las referencias
    nombreRef.current.clear();
    usernameRef.current.clear();
    correoRef.current.clear();
    telefonoRef.current.clear();
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
