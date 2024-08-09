import React from 'react';
import { View, Text, FlatList } from 'react-native';
import CardHistorial from '../Componets/Cards/CardHistorial'; // Asegúrate de que la ruta sea correcta
import styles from '../estilos/HistorialScreenStyles';

const HistorialScreen = ({ navigation }) => {
  // Datos de ejemplo de ofertas
  const ofertas = [
    {
      id: '1',
      title: 'Zapatillas Deportivas Nike',
      description: 'Cantidad : 4',
      fecha: '16/02/24',
      image: 'https://i.pinimg.com/736x/2a/cf/5f/2acf5f8b73e26f38bc018e0bafb70875.jpg',
      price: 49.95,
    },
    {
      id: '2',
      title: 'Sandalias Verano Adidas',
      description: 'Cantidad: 2',
      fecha: '16/02/24',
      image: 'https://i.pinimg.com/564x/dc/16/1b/dc161b4d8cb4a0df94f6c15b613aaf3d.jpg',
      price: 29.99,
    },
    {
      id: '3',
      title: 'Sandalias Verano Adidas',
      description: 'Cantidad: 1',
      fecha: '16/02/24',
      image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/c20afd60-b230-4815-bfd2-6768c875f6cd/calzado-air-force-1-07-J7xw5P.png',
      price: 29.99,
    },
    {
      id: '4',
      title: 'Sandalias Verano Adidas',
      description: 'Cantidad: 5',
      fecha: '16/02/24',
      image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/022c7053-5c55-4bc4-8cdc-72c6e8f95a5e/tenis-air-jordan-1-retro-high-og-latte-Dw2wdP.png',
      price: 29.99,
    },
    {
      id: '5',
      title: 'Sandalias Verano Adidas',
      description: 'Cantidad. 3',
      fecha: '16/02/24',
      image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f37fca8-6bce-43e7-ad07-f57ae3c13142/calzado-air-force-1-07-jBrhbr.png',
      price: 29.99,
    },
    {
      id: '6',
      title: 'Sandalias Verano Adidas',
      description: 'Cantidad: 2',
      fecha: '16/02/24',
      image: 'https://originalselsalvador.com/wp-content/uploads/2024/01/calzado-blazer-mid-77-vintage-nw30B2-min.png',
      price: 29.99,
    },
    {
      id: '7',
      title: 'Sandalias Verano Adidas',
      description: 'Cantidad: 1',
      fecha: '16/02/24',
      image: 'https://i.pinimg.com/564x/dc/16/1b/dc161b4d8cb4a0df94f6c15b613aaf3d.jpg',
      price: 29.99,
    },
  ];

  // Función para manejar la acción al presionar una tarjeta
  const handlePress = (item) => {
    navigation.navigate('DetallesProducto', { producto: item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      <FlatList
        data={ofertas}
        renderItem={({ item }) => <CardHistorial item={item} onPress={() => handlePress(item)} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default HistorialScreen;
