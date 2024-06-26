import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../estilos/DashboardScreenStyles';

const DashboardScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const categories = [
    { title: 'Categorías', icon: 'grid-outline' },
    { title: 'Ofertas', icon: 'gift-outline' },
    { title: 'Historial', icon: 'time-outline' }
  ];

  const images = [
    'https://eldinero.com.do/wp-content/uploads/calzado-deportivo-adidas.jpg',
    'https://media.gq.com.mx/photos/5df2c28cf428fa0008c870a5/master/w_7184,c_limit/los-10-mejores-tenis-en-amazon-para-empezar-el-2020.jpg',
    'https://img.freepik.com/fotos-premium/par-zapatillas-deportivas-adidas-iluminan-habitacion-oscura_853645-10469.jpg',
    'https://www.experimenta.es/wp-content/uploads/2016/12/zapatillas-biodegradables-de-fibra-de-seda-de-arana-artificial-de-adidas-800x599.jpg',
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      // Deshabilita los gestos de retroceso en dispositivos Android
      // Solo afecta a este componente específico
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
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              if (category.title === 'Categorías') {
                navigation.navigate('Categorias');
              } else if (category.title === 'Ofertas') {
                navigation.navigate('Ofertas');
              } else if (category.title === 'Historial') {
                navigation.navigate('Historial');
              }
            }}
          >
            <Ionicons name={category.icon} size={40} color="#000" />
            <Text style={styles.cardTitle}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="lock-closed" size={24} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DashboardScreen;
