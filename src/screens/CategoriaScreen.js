import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Importa el icono de Ionicons
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import styles from '../estilos/CategoriaScreenStyles'; // Importa los estilos desde un archivo externo
import * as Constantes from '../utils/constantes'; // Importa constantes, probablemente IP

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
  const [loading, setLoading] = useState(true); // Estado para controlar el estado de carga
  const [refreshing, setRefreshing] = useState(false); // Estado para el control de la acción de refrescar

  const ip = Constantes.IP; // Variable para la dirección IP o la URL base de la API

  // Función asincrónica para obtener las categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${ip}/fontechpriv/api/services/public/categoria.php?action=readAll`, {
        method: 'GET', // Método GET para obtener datos
      });
      const data = await response.json(); // Convertir la respuesta a JSON
      if (data.status) {
        setCategories(data.dataset); // Si hay éxito, establece las categorías en el estado
      } else {
        Alert.alert('Error', data.message); // Muestra una alerta en caso de error desde la API
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al obtener las categorías'); // Muestra una alerta en caso de excepción
    } finally {
      setLoading(false); // Establece loading en false para indicar que la carga ha finalizado
      setRefreshing(false); // Establece refreshing en false para indicar que el refresco ha finalizado
    }
  };

  useEffect(() => {
    fetchCategories(); // Llama a fetchCategories al montar el componente
  }, []); // El segundo argumento de useEffect es un array vacío, por lo que se ejecuta solo una vez al montar

  // Función para manejar la acción de refrescar
  const handleRefresh = () => {
    setRefreshing(true); // Establece refreshing en true para mostrar el indicador de refresco
    fetchCategories(); // Llama a fetchCategories para obtener las categorías actualizadas
  };

  // Filtra las categorías basado en el texto de búsqueda ingresado
  const filteredCategories = categories.filter((category) =>
    category.nombre_categoria.toLowerCase().includes(searchText.toLowerCase())
  );

  // Función para manejar la acción de "Ver más" en una categoría específica
  const handleVerMas = (category) => {
    // navigation.navigate('Producto', { idCategoria: category.id_categoria }); // Comentado para pruebas sin navegación
    console.log('Ver más:', category.nombre_categoria); // Muestra el nombre de la categoría en la consola
  };

  // Renderiza un indicador de carga mientras se obtienen las categorías
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Renderiza la pantalla principal con las categorías y la opción de refrescar
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={styles.title}>Categoria</Text>
      <View style={styles.grid}>
        {filteredCategories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => handleVerMas(category)}>
            <Image source={{ uri: `${ip}/fontechpriv/api/images/categorias/${category.imagen}` }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{category.nombre_categoria}</Text>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Ver más</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen; // Exporta el componente DashboardScreen
