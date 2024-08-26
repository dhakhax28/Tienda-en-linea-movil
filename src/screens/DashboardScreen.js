import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import styles from '../estilos/DashboardScreenStyles';
import Cards1 from '../Componets/Cards/Cards1';
import { Ionicons } from '@expo/vector-icons';
import * as Constantes from '../utils/constantes';

// URL base de la API
const ip = Constantes.IP;

const DashboardScreen = ({ navigation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState(''); // Estado para el nombre del usuario
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timeIntervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(timeIntervalId);
  }, []);

  // Cambiar imagen del carrusel cada 5 segundos
  useEffect(() => {
    const imageIntervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(imageIntervalId);
  }, []);

  useEffect(() => {
    const hours = currentTime.getHours();
    if (hours < 12) {
      setGreeting(`¡Buenos días, ${userName}!`);
    } else if (hours < 18) {
      setGreeting(`¡Buenas tardes, ${userName}!`);
    } else {
      setGreeting(`¡Buenas noches, ${userName}!`);
    }
  }, [currentTime, userName]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ip}/FontechPriv/api/services/public/cliente.php?action=readProfile`);
      const data = await response.json();

      if (data.status) {
        setUserName(data.dataset.nombre);
      } else {
        throw new Error(data.error || 'No se pudo obtener el perfil');
      }
    } catch (error) {
      console.error('Fetch Profile Error:', error);
      Alert.alert('Error', 'Ocurrió un error al obtener el perfil');
    } finally {
      setLoading(false);
      setRefreshing(false); // Terminar la animación de recarga
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileData();
  }, []);

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

  const categories = [
    { title: 'Categorías', icon: 'grid-outline', navigateTo: 'Categorias' },
    
    { title: 'Historial', icon: 'time-outline', navigateTo: 'Historial' },
  ];

  const images = [
    'https://images.pexels.com/photos/5989894/pexels-photo-5989894.jpeg',
    'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/20348034/pexels-photo-20348034/free-photo-of-telefono-inteligente-tecnologia-negro-samsung.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/12563780/pexels-photo-12563780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      gestureEnabled={false}
      gestureDirection="horizontal"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0000ff']} // Color del spinner de recarga
        />
      }
    >
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeMessage}>{greeting}</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>{currentTime.toLocaleDateString()}</Text>
          <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
        </View>
      </View>

      <Image
        source={{ uri: images[currentImageIndex] }}
        style={styles.banner}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      <View style={styles.grid}>
        {categories.map((category, index) => (
          <Cards1
            key={index}
            title={category.title}
            icon={category.icon}
            onPress={() => navigation.navigate(category.navigateTo)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="lock-closed" size={24} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DashboardScreen;
