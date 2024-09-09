import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location'; // Importar para permisos
import * as Constantes from '../utils/constantes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DebouncedSearchInput from '../screens/DebouncedSearchInput';
import CustomAlert from '../estilos/CustomAlert';
import styles from '../estilos/RegisterScreenStyles';
import ButtonofRegisters from "../Componets/Buttons/ButtonofRegisters";
import InputsRegister from '../Componets/Inputs/InputsRegister';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({
    latitude: 13.69294,
    longitude: -89.21819,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const navigation = useNavigation();
  const ip = Constantes.IP;
  const apiKey = "052db57c37214995836949fa033d4518"; // Clave de OpenCage

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso de ubicación requerido', 'La aplicación necesita acceso a tu ubicación.');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmarClave.trim() ||
      !address.trim()
    ) {
      setAlertMessage('Debes llenar todos los campos');
      setAlertVisible(true);
      return;
    }

    if (password !== confirmarClave) {
      setAlertMessage('Las contraseñas no coinciden');
      setAlertVisible(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombreCliente', name);
      formData.append('usuarioCliente', username);
      formData.append('correoCliente', email);
      formData.append('claveCliente', password);
      formData.append('confirmarClave', confirmarClave);
      formData.append('direccionCliente', address);

      const response = await fetch(`${ip}/FonTechPriv/api/services/public/cliente.php?action=signUpMovil`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.status) {
        setAlertMessage('Usuario creado correctamente');
        setAlertVisible(true);
        navigation.navigate('Login');
      } else {
        setAlertMessage(`Error: ${data.error}`);
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage('Ocurrió un error al intentar crear el usuario');
      setAlertVisible(true);
    }
  };

  const handleLoginRedirect = () => {
    navigation.navigate('Login');
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({
      ...location,
      latitude,
      longitude,
    });

    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
      if (response.data && response.data.results && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted;
        setAddress(formattedAddress);
      } else {
        setAddress('Dirección no disponible');
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      setAddress('Error al obtener la dirección');
    }
  };

  const handleSearchAddress = async (text) => {
    if (!text || text.trim() === '') {
      console.log('La consulta de búsqueda está vacía.');
      return;
    }

    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(text)}&key=${apiKey}`);
      if (response.data && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setLocation({
          ...location,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        });
      } else {
        console.log('No se encontraron resultados.');
      }
    } catch (error) {
      console.error('Error al buscar la dirección:', error.response ? error.response.data : error.message);
    }
  };

  const handleClearAddress = () => {
    setAddress('');
    setLocation({
      latitude: 13.69294,
      longitude: -89.21819,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require('../img/registro.png')} style={styles.logo} />
        <Text style={styles.title}>Registro</Text>
      </View>

      <InputsRegister
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
      />
      <InputsRegister
        value={username}
        onChangeText={setUsername}
        placeholder="Usuario"
      />
      <InputsRegister
        value={email}
        onChangeText={setEmail}
        placeholder="Correo"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <InputsRegister
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <Icon name={passwordVisible ? "eye" : "eye-off"} size={24} color="grey" />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <InputsRegister
          value={confirmarClave}
          onChangeText={setConfirmarClave}
          placeholder="Confirmar contraseña"
          secureTextEntry={!confirmPasswordVisible}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
          <Icon name={confirmPasswordVisible ? "eye" : "eye-off"} size={24} color="grey" />
        </TouchableOpacity>
      </View>
      <View style={styles.addressContainer}>
        <DebouncedSearchInput
          onSearch={handleSearchAddress}
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAddress}>
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        region={location}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
        <Marker coordinate={location} />
      </MapView>
      <ButtonofRegisters title="Registrarse" onPress={handleRegister} />
      <Text style={styles.loginText} onPress={handleLoginRedirect}>
        ¿Ya tienes una cuenta? Inicia sesión
      </Text>
      <CustomAlert
        isVisible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
};

export default RegisterScreen;
