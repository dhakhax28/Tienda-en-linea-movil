import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../estilos/DashboardScreenStyles';
import * as Constantes from '../utils/constantes';
import Cards1 from '../Componets/Cards/Cards1';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation }) => {
  const ip = Constantes.IP;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Ocurrió un error al cerrar sesión');
    }
  };

  const categories = [
    { title: 'Categorías', icon: 'grid-outline', navigateTo: 'Categorias' },
    { title: 'Ofertas', icon: 'gift-outline', navigateTo: 'Ofertas' },
    { title: 'Historial', icon: 'time-outline', navigateTo: 'Historial' },
  ];

  const images = [
    'https://images.pexels.com/photos/5989894/pexels-photo-5989894.jpeg',
    'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/20348034/pexels-photo-20348034/free-photo-of-telefono-inteligente-tecnologia-negro-samsung.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/12563780/pexels-photo-12563780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      gestureEnabled={false}
      gestureDirection="horizontal"
    >
      <Image
        source={{ uri: images[currentImageIndex] }}
        style={styles.banner}
      />

      <Text style={styles.title}>Dashboard</Text>

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
