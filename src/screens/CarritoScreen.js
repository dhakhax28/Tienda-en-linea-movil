import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Image } from 'react-native';
import * as Constantes from '../utils/constantes';
import styles from '../estilos/CarritoScreenStyles';
import { useIsFocused } from '@react-navigation/native';
import CardCarrito from '../Componets/Cards/CardCarrito';

const CarritoScreen = ({ navigation }) => {
  const [carrito, setCarrito] = useState([]); // Estado para almacenar los productos en el carrito
  const [loading, setLoading] = useState(true);// Estado para manejar el indicador de carga
  const [refreshing, setRefreshing] = useState(false); // Estado para manejar el indicador de refresh
  const [subtotal, setSubtotal] = useState(0); // Estado para almacenar el subtotal del carrito
  const [descuento, setDescuento] = useState(0);// Estado para almacenar el descuento aplicado

  const ip = Constantes.IP;
  const isFocused = useIsFocused();

  const fetchCarrito = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ip}/FontechPriv/api/services/public/pedido.php?action=readDetail`);
      const data = await response.json();
      if (data.status) {
        setCarrito(data.dataset);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al obtener los datos del carrito');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ip]);

  useEffect(() => {
    if (isFocused) {
      fetchCarrito();
    }
  }, [isFocused, fetchCarrito]);

  const handleQuantityChange = async (item, type) => {
    let newCantidad = item.cantidad;

    if (type === 'increase') {
      if (newCantidad >= 5) {
        Alert.alert('Límite alcanzado', 'No puedes agregar más de 5 productos.');
        return;
      }
      newCantidad++;
    } else if (type === 'decrease') {
      newCantidad--;
    }

    if (newCantidad < 1) return;

    try {
      const formData = new FormData();
      formData.append('idDetalle', item.id_detalle_reserva.toString());
      formData.append('cantidadProducto', newCantidad.toString());

      const response = await fetch(`${ip}/FontechPriv/api/services/public/pedido.php?action=updateDetail`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 1) {
        setCarrito(prevCarrito => (
          prevCarrito.map(producto =>
            producto.id_detalle_reserva === item.id_detalle_reserva ? { ...producto, cantidad: newCantidad } : producto
          )
        ));
        // Eliminamos la alerta de éxito aquí
        // Alert.alert('Éxito', data.message);
      } else {
        Alert.alert('Error', data.error || 'Ocurrió un problema al actualizar la cantidad del producto');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar la cantidad del producto');
      console.error(error);
    }
  };

  const handleDelete = async (idDetalle) => {
    try {
      const formData = new FormData();
      formData.append('idDetalle', idDetalle);

      const response = await fetch(`${ip}/FontechPriv/api/services/public/pedido.php?action=deleteDetail`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 1) {
        const updatedCarrito = carrito.filter(producto => producto.id_detalle_reserva !== idDetalle);
        setCarrito(updatedCarrito);
        Alert.alert('Éxito', data.message);
      } else {
        Alert.alert('Error', data.error || 'Ocurrió un problema al eliminar el producto');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al eliminar el producto del carrito');
      console.error(error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCarrito();
  }, [fetchCarrito]);

  useEffect(() => {
    fetchCarrito();
  }, [fetchCarrito]);

  useEffect(() => {
    const calcularSubtotal = () => {
      let total = 0;
      let descuentoTotal = 0;

      carrito.forEach(item => {
        const subtotalProducto = item.precio_unitario * item.cantidad;
        if (item.valor_oferta) {
          const subtotalConDescuento = subtotalProducto - (subtotalProducto * item.valor_oferta) / 100;
          total += subtotalConDescuento;
          descuentoTotal += subtotalProducto - subtotalConDescuento;
        } else {
          total += subtotalProducto;
        }
      });

      setSubtotal(total);
      setDescuento(descuentoTotal);
    };

    calcularSubtotal();
  }, [carrito]);

  const finalizarCompra = async () => {
    if (carrito.length === 0) {
      Alert.alert('Carrito Vacío', 'No hay productos seleccionados en el carrito.');
      return;
    }

    try {
      const response = await fetch(`${ip}/FontechPriv/api/services/public/pedido.php?action=finishOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === 1) {
        Alert.alert('Compra Finalizada', '¡Gracias por tu compra!');
        setCarrito([]);
      } else {
        Alert.alert('Error', data.error || 'Ocurrió un problema al finalizar el pedido');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al finalizar la compra');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito</Text>
      <FlatList
        data={carrito}
        renderItem={({ item }) => (
          <CardCarrito
            item={item}
            onIncrease={(item) => handleQuantityChange(item, 'increase')}
            onDecrease={(item) => handleQuantityChange(item, 'decrease')}
            onDelete={(idDetalle) => handleDelete(idDetalle)}
          />
        )}
        keyExtractor={(item) => item?.id_detalle_reserva?.toString() ?? item.id_detalle_reserva.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']}
            tintColor="#0000ff"
          />
        }
      />
      {carrito.length === 0 && (
        <View style={styles.emptyCarritoContainer}>
          <Image
            source={{ uri: 'https://static.vecteezy.com/system/resources/previews/009/417/131/original/ecommerce-icon-empty-yellow-shopping-cart-3d-illustration-free-png.png' }}
            style={styles.emptyCartImage}
          />
          <Text style={styles.emptyCarritoText}>No hay productos en el carrito.</Text>
        </View>
      )}
      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotalText}>Subtotal: ${subtotal.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.finalizarCompraButton} onPress={finalizarCompra}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Finalizar compra</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
    </View>
  );
};

export default CarritoScreen;
