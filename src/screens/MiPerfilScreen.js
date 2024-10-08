import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styles from '../estilos/MiPerfilScreenStyles'; // Asegúrate de que este archivo esté correcto
import * as Constantes from '../utils/constantes';

const MiPerfilScreen = () => {
  const ip = Constantes.IP;
  const apiKeyOpenCage = '052db57c37214995836949fa033d4518'; // Tu clave API de OpenCage

  // Estados para los datos del perfil
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 13.6929,
    longitude: -89.2182,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [editando, setEditando] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Referencias para los TextInput
  const nombreRef = useRef(null);
  const usernameRef = useRef(null);
  const correoRef = useRef(null);
  const direccionRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${ip}/FonTechPriv/api/services/public/cliente.php?action=readProfile`);
      const data = await response.json();

      if (data.status) {
        setNombre(data.dataset.nombre);
        setUsername(data.dataset.usuario);
        setCorreo(data.dataset.correo);
        setDireccion(data.dataset.direccion);

        // Utiliza OpenCage para obtener las coordenadas reales de la dirección
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(data.dataset.direccion)}&key=${apiKeyOpenCage}`;
        const geoResponse = await fetch(url);
        const geoData = await geoResponse.json();

        console.log('Geolocation Data:', geoData); // Verifica qué datos devuelve la API

        if (geoData.results.length > 0) {
          const { lat, lng } = geoData.results[0].geometry;
          const newRegion = {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(newRegion); // Esto actualizará el mapa
        } else {
          setRegion({
            latitude: 13.6929,
            longitude: -89.2182,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          });
          Alert.alert('Error', 'No se encontró la ubicación');
        }
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al obtener el perfil');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Función para manejar la actualización de los datos del perfil
  const handleUpdate = async () => {
    // Validación de campos vacíos
    if (!nombre || !username || !correo || !direccion) {
      Alert.alert('Error', 'Todos los campos deben ser llenados');
      return;
    }

    try {
      // Crea un objeto con los datos del perfil
      const formData = new FormData();
      formData.append('nombreCliente', nombre);
      formData.append('correoCliente', correo);
      formData.append('aliaCliente', username);
      formData.append('direc', direccion);

      // URL de la API para actualizar el perfil
      const url = `${ip}/FonTechPriv/api/services/public/cliente.php?action=editProfile`;

      // Realiza la solicitud POST para actualizar el perfil
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseJson = await response.json();
      console.log('API Response:', responseJson); // Imprime la respuesta JSON

      // Manejo de la respuesta
      if (responseJson.status === 1) {
        Alert.alert('Perfil actualizado', 'Los datos del perfil han sido actualizados exitosamente');
        setEditando(false); // Desactiva el modo de edición
      } else {
        // Muestra un mensaje de error si el perfil no se pudo actualizar
        Alert.alert('Error', responseJson.error || 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      // Muestra un mensaje de error en caso de que ocurra un problema
      Alert.alert('Error', 'Ocurrió un error al actualizar el perfil');
      console.error('Error al actualizar el perfil:', error);
    }
  };

  // Función para manejar la cancelación y limpiar los campos
  const handleDelete = () => {
    // Limpiar los valores de los campos directamente mediante el estado
    setNombre('');
    setUsername('');
    setCorreo('');
    setDireccion('');

    // Limpiar el valor de los campos de entrada usando las referencias no es necesario
    setEditando(false);
    fetchProfile(); // Actualiza los datos del perfil al cancelar
  };

  // Función para obtener la dirección basada en las coordenadas
  const reverseGeocode = async (lat, lon) => {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?lat=${lat}&lon=${lon}&key=${apiKeyOpenCage}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log('Reverse Geocode Data:', data);

      if (data.results.length > 0) {
        const address = `${data.results[0].formatted}`;
        setDireccion(address);
      } else {
        Alert.alert('Error', 'No se encontró la dirección para esta ubicación');
      }
    } catch (error) {
      console.error('Reverse Geocode Error:', error);
      Alert.alert('Error', 'Ocurrió un error al obtener la dirección');
    }
  };

  // Función para manejar el clic en el mapa para cambiar la ubicación
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    if (editando) {
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      reverseGeocode(latitude, longitude); // Actualiza la dirección basada en las nuevas coordenadas
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile();
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
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
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
            onChangeText={setDireccion}
            value={direccion}
            editable={editando}
          />
        </View>

        {/* Mapa */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onPress={handleMapPress}
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          </MapView>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          {editando ? (
            <>
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>Actualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default MiPerfilScreen;
