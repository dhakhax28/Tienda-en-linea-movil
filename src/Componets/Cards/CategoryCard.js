// CategoryCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../estilos/CategoriaScreenStyles'; // Asegúrate de que la ruta sea correcta

const CategoryCard = ({ category, onPress }) => {
  const ip = Constantes.IP; // Importa Constantes si no está disponible aquí

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(category)}>
      <Image 
        source={{ uri: `${ip}/FonTechPriv/api/images/categorias/${category.imagen}` }} 
        style={styles.cardImage} 
      />
      <Text style={styles.cardTitle}>{category.nombre_categoria}</Text>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Ver más</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;
