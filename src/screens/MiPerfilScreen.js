import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styles from '../estilos/MiPerfilScreenStyles';
import * as Constantes from '../utils/constantes';

const MiPerfilScreen = () => {
  const ip = Constantes.IP;

  // Estados para los datos del perfil
  // Estados para los datos del perfil
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState(''); // Debe corresponder a aliaCliente en PHP
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 13.6929, // Latitud de San Salvador por defecto
    longitude: -89.2182, // Longitud de San Salvador por defecto
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [editando, setEditando] = useState(false); // Estado para controlar la edición
  // Estado para controlar la edición

  // Referencias para los TextInput
  const nombreRef = useRef(null);
  const usernameRef = useRef(null);
  const correoRef = useRef(null);
  const direccionRef = useRef(null);

  // Función para obtener y mostrar el perfil del usuario
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${ip}/fontechpriv/api/services/public/cliente.php?action=readProfile`);
      const data = await response.json();

      console.log('Perfil Data:', data);

      if (data.status) {
        setNombre(data.dataset.nombre);
        setUsername(data.dataset.usuario);
        setCorreo(data.dataset.correo);
        setDireccion(data.dataset.direccion);

        // Utiliza Nominatim para obtener las coordenadas reales de la dirección
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.dataset.direccion)}`;
        const response = await fetch(url);
        const geoData = await response.json();

        console.log('Geocode Data:', geoData);

        if (geoData.length > 0) {
          const { lat, lon } = geoData[0];
          const newRegion = {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(newRegion);
          console.log('New Region:', newRegion);
        } else {
          setRegion({
            latitude: 13.6929,
            longitude: -89.2182,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          });
          console.log('Default Region:', region);
          Alert.alert('Error', 'No se encontró la ubicación');
        }
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error('Fetch Profile Error:', error);
      Alert.alert('Error', 'Ocurrió un error al obtener el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la actualización de los datos del perfil
  // Función para manejar la actualización de los datos del perfil
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('nombreCliente', nombre);
      formData.append('correoCliente', correo);
      formData.append('aliaCliente', username); // username en React Native corresponde a aliaCliente en PHP

      const url = `${ip}/fontechpriv/api/services/public/cliente.php?action=editProfile`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        Alert.alert('Perfil actualizado', 'Los datos del perfil han sido actualizados exitosamente');
      } else {
        Alert.alert('Error', 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar el perfil');
    }
  };


  // Función para manejar la cancelación y limpiar los campos
  const handleDelete = () => {
    setNombre('');
    setUsername('');
    setCorreo('');
    setDireccion('');

    nombreRef.current.clear();
    usernameRef.current.clear();
    correoRef.current.clear();
    direccionRef.current.clear();
    setEditando(false); // Asegura que el modo edición se desactive al cancelar
    fetchProfile(); // Actualiza los datos del perfil al cancelar
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
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
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
            ref={nombreRef}
            style={styles.input}
            onChangeText={setNombre}
            value={nombre}
            editable={editando}
          />
        </View>

        {/* Contenedor para el campo Usuario */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            ref={usernameRef}
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            editable={editando}
          />
        </View>

        {/* Contenedor para el campo Correo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            ref={correoRef}
            style={styles.input}
            onChangeText={setCorreo}
            value={correo}
            editable={editando}
          />
        </View>

        {/* Contenedor para el campo Dirección */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            ref={direccionRef}
            style={styles.input}
            onChangeText={(text) => setDireccion(text)}
            value={direccion}
            editable={editando}
            onBlur={fetchProfile} // Actualiza el perfil cuando el usuario sale del campo de dirección
          />
        </View>

        {/* Contenedor para el botón de Editar */}
        {!editando && (
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setEditando(true)}>
            <Text style={[styles.buttonText, styles.updateButtonText]}>Editar</Text>
          </TouchableOpacity>
        )}

        {/* Mapa */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={region}
            region={region}
            maxZoomLevel={12}
            minZoomLevel={9}
          >
            <Marker
              coordinate={region}
              title="Mi Ubicación"
              description="Aquí estoy"
            />
          </MapView>
        </View>

        {/* Contenedor para los botones de acción */}
        {editando && (
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
        )}
      </View>
    </ScrollView>
  );
};

export default MiPerfilScreen;