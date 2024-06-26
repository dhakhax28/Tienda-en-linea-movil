import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Image, Alert, RefreshControl } from 'react-native';
import styles from '../estilos/CategoriaScreenStyles';
import * as Constantes from '../utils/constantes';

const DashboardScreen = ({ navigation }) => {
  const ip = Constantes.IP;
  const [dataCategorias, setDataCategorias] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const animatedValuesRef = useRef([]);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const getCategorias = async () => {
    try {
      const response = await fetch(`${ip}/fontechpriv/api/services/public/categoria.php?action=readAll`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data.status) {
        setDataCategorias(data.dataset);
        animatedValuesRef.current = data.dataset.map(() => new Animated.Value(0));
      } else {
        Alert.alert('Error categorias', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al listar las categorias');
    } finally {
      setRefreshing(false);
    }
  };

  const refreshScreen = () => {
    setRefreshing(true);
    getCategorias();
  };

  useEffect(() => {
    getCategorias();
  }, []);

  const handlePressIn = (index) => {
    if (animatedValuesRef.current[index]) {
      Animated.timing(animatedValuesRef.current[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePressOut = (index) => {
    if (animatedValuesRef.current[index]) {
      Animated.timing(animatedValuesRef.current[index], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const cardBackgroundColor = (index, bgColor) => {
    if (animatedValuesRef.current[index]) {
      return animatedValuesRef.current[index].interpolate({
        inputRange: [0, 1],
        outputRange: ['#fff', bgColor],
      });
    }
    return '#fff';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshScreen} />
        }
      >
        <View style={styles.grid}>
          {dataCategorias.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('Producto', { idCategoria: category.id_categoria })} // Asegúrate de que el nombre sea 'Producto'
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
            >
              <Animated.View style={[styles.card, { backgroundColor: cardBackgroundColor(index, '#33CCFF') }]}>
                <Image source={{ uri: `${ip}/fontechpriv/api/images/categorias/${category.imagen}` }} style={styles.image} />
                <Text style={styles.cardTitle}>{category.nombre_categoria}</Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
