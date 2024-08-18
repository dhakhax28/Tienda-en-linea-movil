import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importar Ionicons
import styles from '../estilos/LoginScreenStyles'; // Importar estilos desde un archivo externo
import Button3 from '../Componets/Buttons/Button3';
import LogOut from '../Componets/LogOut';
import * as Constantes from '../utils/constantes'; // Importar constantes, suponiendo que tienes la IP en un archivo de constantes

const LoginScreen = ({ navigation }) => {
  const ip = Constantes.IP; // Definir la IP de la API
  const [username, setUsername] = useState(''); // Estado para el nombre de usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar la visibilidad de la contraseña
  const animatedValue = new Animated.Value(0); // Estado para la animación del logo

  useEffect(() => {
    // Configuración de animación en bucle
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );

    // Iniciar la animación
    animation.start();

    // Limpiar la animación cuando el componente se desmonte
    return () => {
      animation.stop();
    };
  }, []);

  // Interpolación para la animación de traducción vertical del logo
  const translateY = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 20, 0],
  });

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('UsuarioCliente', username); // Agregar nombre de usuario a los datos del formulario
      formData.append('clave', password); // Agregar contraseña a los datos del formulario
      
      const url = `${ip}/FontechPriv/public/cliente.php?action=logIn`; // URL para la solicitud
      console.log('URL solicitada:', url); // Para verificar la URL

      // Hacer la solicitud a la API
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text(); // Obtener la respuesta como texto

      try {
        const data = JSON.parse(responseText); // Intentar parsear la respuesta como JSON
        if (data.status) {
          navigation.navigate('DashboardTabs'); // Navegar a la pantalla de pestañas del dashboard
        } else {
          showLoginErrorAlert(); // Mostrar una alerta personalizada en caso de error
        }
      } catch (jsonError) {
        console.error('Error al parsear JSON:', jsonError);
        console.error('Respuesta recibida:', responseText);
        Alert.alert('Error', 'Ocurrió un error al procesar la respuesta del servidor');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  // Redirigir a la pantalla de registro
  const handleRegisterRedirect = () => {
    navigation.navigate('Register');
  };

  // Redirigir a la pantalla de recuperación de contraseña
  const handleForgotPasswordRedirect = () => {
    navigation.navigate('PasswordRecovery');
  };

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      const url = `${ip}/FontechPriv/api/services/public/cliente.php?action=logOut`;
      console.log('URL solicitada:', url); // Verificar la URL en la consola

      const response = await fetch(url, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.status) {
        Alert.alert('Sesión cerrada exitosamente');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Ocurrió un error al cerrar sesión');
    }
  };

  // Función para mostrar alerta de error de inicio de sesión
  const showLoginErrorAlert = () => {
    Alert.alert(
      'Error de inicio de sesión',
      'Usuario o contraseña incorrectos',
      [
        {
          text: 'OK',
          style: 'default',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log('Alert dismissed'),
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Logo animado */}
      <Animated.Image
        source={require('../img/calentamiento.png')}
        style={[styles.logo, { transform: [{ translateY }] }]}
      />
      {/* Título de la pantalla */}
      <Text style={styles.title}>Inicio de sesión</Text>
      
     
      
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Contraseña"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={!showPassword} // Asegurar que la contraseña sea segura
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      

      {/* Botón de inicio de sesión */}
      <Button3 style={styles.button} onPress={() => navigation.navigate('DashboardTabs')}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Button3>

      {/* Enlace para redirigir a la pantalla de registro */}
      <TouchableOpacity onPress={handleRegisterRedirect}>
        <Text style={styles.registerLink}>¿No tienes cuenta? Crea una</Text>
      </TouchableOpacity>
      
      {/* Enlace para redirigir a la pantalla de recuperación de contraseña */}
      <TouchableOpacity onPress={handleForgotPasswordRedirect}>
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      
      {/* Botón de cerrar sesión */}
      <LogOut
        title="Cerrar Sesión"
        onPress={handleLogout}
        style={styles.logoutButton}
        textStyle={{ color: '#7f7f7f' }}
        icon={<Ionicons name="lock-closed" size={24} color="black" />}
      />
    </View>
  );
};

export default LoginScreen;
