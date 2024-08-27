import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../estilos/DetallesProductosScreen';
import * as Constantes from '../utils/constantes';

const DetallesProductoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { idProducto } = route.params;
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [rating, setRating] = useState(0); // Estado para la calificación
  const [comentario, setComentario] = useState(''); // Estado para el comentario
  const [comentarios, setComentarios] = useState([]); // Estado para lista de comentarios

  const ip = Constantes.IP;

  const fetchProducto = async () => {
    try {
      const formData = new FormData();
      formData.append('idProducto', idProducto);
      const response = await fetch(`${ip}/FonTechPriv/api/services/public/producto.php?action=readOne`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status) {
        setProducto(data.dataset);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al obtener los detalles del producto');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleHabilitado= async () => {
    try {
      const formData = new FormData();
      formData.append('idProducto1', idProducto);
      
      const url = `${ip}/FonTechPriv/api/services/public/comentario.php?action=verifComent`;
      console.log('URL solicitada:', url); // Para verificar la URL

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text(); // Obtén la respuesta como texto

      try {
        const data = JSON.parse(responseText); // Intenta parsear la respuesta como JSON
        if (data.status) {
          habilitado=false;
        } else {
          habilitado=true;
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

  const fetchComentarios = async () => {
    try {
      const formData = new FormData();
      formData.append('idProducto1', idProducto);
      const response = await fetch(`${ip}/FonTechPriv/api/services/public/comentario.php?action=readAllByProducto`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status) {
        setComentarios(data.dataset);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al obtener los comentarios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshScreen = () => {
    setRefreshing(true);
    fetchProducto();
    fetchComentarios();
    handleHabilitado();
  };

  useEffect(() => {
    fetchProducto();
    fetchComentarios();
    handleHabilitado();
  }, []);

  const agregarAlCarrito = async () => {
    const cantidadNumerica = parseInt(cantidadProducto, 10);
   
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
      Alert.alert('Error', 'Por favor, ingresa una cantidad válida');
      return;
    }
 
    if (cantidadNumerica > 5) {
      Alert.alert('Error', 'La cantidad máxima permitida es 5');
      return;
    }
 
    if (cantidadNumerica > producto.existencias_producto) {
      Alert.alert('Error', `No hay suficiente stock. Solo hay ${producto.existencias_producto} en existencia`);
      return;
    }
 
    try {
      const formData = new FormData();
      formData.append('idProducto', idProducto);
      formData.append('cantidadProducto', cantidadProducto);
 
      const response = await fetch(`${ip}/FonTechPriv/api/services/public/pedido.php?action=createDetail`, {
        method: 'POST',
        body: formData,
      });
 
      const data = await response.json();
 
      if (data.status) {
        Alert.alert('Éxito', 'Producto añadido al carrito', [
          {
            text: 'Ok',
            onPress: () => navigation.navigate('DashboardTabs', { screen: 'Carrito' }), // Navegar al tab 'Carrito'
          },
       
        ]);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al agregar el producto al carrito');
    }
  };
 


  const handleRatingPress = (star) => {
    setRating(star); // Actualiza la calificación según la estrella clickeada
  };

  const handleAddComment = () => {
    if (comentario.trim()) {
      // Combina la valoración y el comentario
      const newComment = { rating, comentario };
      setComentarios([...comentarios, newComment]);
      setRating(0); // Limpia la calificación
      setComentario(''); // Limpia el campo de comentario después de agregar
    } else {
      Alert.alert('Error', 'El comentario no puede estar vacío');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!producto) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontraron detalles del producto</Text>
      </View>
    );
  }

  const handleComentario = async () => {

    try {
      const formData = new FormData();
      formData.append('floatingTextarea2', comentario);
      formData.append('starValue', rating);
      formData.append('idProducto1', idProducto);

      const response = await fetch(`${ip}/FonTechPriv/api/services/public/comentario.php?action=createComentario`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.status) {
        Alert.alert('Comentario creado correctamente');
      } else {
        Alert.alert(`Error: ${data.error}`);
      }
    } catch (error) {
      Alert.alert('Ocurrió un error al intentar crear el comentario');
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshScreen}
        />
      }
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Image source={{ uri: `${ip}/FonTechPriv/api/images/productos/${producto.imagen}` }} style={styles.image} />

      <Text style={styles.title}>{producto.nombre_producto}</Text>
      <Text style={styles.description}>{producto.descripcion}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Marca:</Text>
          <Text style={styles.detailsValue}>{producto.marca}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Almacenamiento Interno:</Text>
          <Text style={styles.detailsValue}>{producto.capacidad_memoria_interna_celular}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Ram:</Text>
          <Text style={styles.detailsValue}>{producto.ram_celular}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Tamaño de la pantalla:</Text>
          <Text style={styles.detailsValue}>{producto.pantalla_tamaño}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Cámara trasera:</Text>
          <Text style={styles.detailsValue}>{producto.camara_trasera_celular}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Cámara Frontal:</Text>
          <Text style={styles.detailsValue}>{producto.camara_frontal_celular}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Procesador:</Text>
          <Text style={styles.detailsValue}>{producto.procesador_celular}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Sistema operativo:</Text>
          <Text style={styles.detailsValue}>{producto.sistema_operativo_celular}</Text>
        </View>
      </View>

      <View style={styles.pricingInfoContainer}>
        <View style={styles.pricingInfoRow}>
          <Text style={styles.pricingInfoLabel}>Precio unitario (US$):</Text>
          <Text style={styles.pricingInfoValue}>{producto.precio}</Text>
        </View>
        <View style={styles.pricingInfoRow}>
          <Text style={styles.pricingInfoLabel}>Existencias:</Text>
          <Text style={styles.pricingInfoValue}>{producto.existencias}</Text>
        </View>
        <View style={styles.pricingInfoRow}>
          <Text style={styles.pricingInfoLabel}>Descuento:</Text>
          <Text style={styles.pricingInfoValue}>{producto.valor_oferta}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cantidad</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            keyboardType="numeric"
            onChangeText={setCantidadProducto}
            value={cantidadProducto.toString()}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={agregarAlCarrito}>
        <Text style={styles.addButtonText}>Añadir al carrito</Text>
      </TouchableOpacity>

      {/* Apartado de valoración */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Valoración:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={24}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Apartado de comentarios */}
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsLabel}>Comentario:</Text>
        <TextInput
          style={styles.commentsInput}
          placeholder="Escribe tu comentario aquí..."
          value={comentario}
          onChangeText={setComentario}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleComentario}>
          <Text style={styles.submitButtonText}>Agregar Comentario</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar comentarios */}
      <View style={styles.commentsList}>
        {comentarios.map((item, index) => (
          <View key={index} style={styles.commentItem}>
            <Text style={styles.commentText}>Valoración: {item.calificacion_valoracion} estrellas</Text>
            <Text style={styles.commentText}>Comentario: {item.comentario_valoracion}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DetallesProductoScreen;
