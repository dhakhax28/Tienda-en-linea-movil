import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Animated, Easing } from 'react-native';
import styles from '../estilos/LoginScreenStyles'; // Importa los estilos desde un archivo externo

const LoginScreen = ({ navigation }) => {
  // Estados para el nombre de usuario y la contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Estado y efecto para la animación del logo
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    // Configuración de la animación que se repite en bucle
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );

    // Inicia la animación
    animation.start();

    // Limpia la animación al desmontar el componente
    return () => {
      animation.stop();
    };
  }, []);

  // Interpolación para la animación de traslación vertical del logo
  const translateY = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 20, 0],
  });

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    console.log('Nombre de usuario:', username);
    console.log('Contraseña:', password);
    navigation.navigate('DashboardTabs'); // Navega a la pantalla de pestañas del dashboard después del inicio de sesión
  };

  // Función para redirigir a la pantalla de registro
  const handleRegisterRedirect = () => {
    navigation.navigate('Register');
  };

  // Función para redirigir a la pantalla de recuperación de contraseña
  const handleForgotPasswordRedirect = () => {
    navigation.navigate('PasswordRecovery');
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
      {/* Input para el nombre de usuario */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      {/* Input para la contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      {/* Botón para iniciar sesión */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      {/* Enlace para redirigir a la pantalla de registro */}
      <TouchableOpacity onPress={handleRegisterRedirect}>
        <Text style={styles.registerLink}>¿No tienes cuenta? Crea una</Text>
      </TouchableOpacity>
      {/* Enlace para redirigir a la pantalla de recuperación de contraseña */}
      <TouchableOpacity onPress={handleForgotPasswordRedirect}>
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
