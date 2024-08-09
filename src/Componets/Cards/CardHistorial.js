import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../../estilos/HistorialScreenStyles'; // Asegúrate de que la ruta sea correcta

const CardHistorial = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.ofertaCard} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.ofertaImage} />
      <View style={styles.ofertaDetails}>
        <Text style={styles.ofertaTitle}>{item.title}</Text>
        <Text style={styles.ofertaDescription}>{item.description}</Text>
        <Text style={styles.fecha}>{item.fecha}</Text>
        <View style={styles.ofertaPriceContainer}>
          <Text style={styles.ofertaPrice}>${item.price.toFixed(2)}</Text>
          {/* Renderiza un badge de descuento si el producto tiene descuento */}
          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{item.discount}%</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardHistorial;
