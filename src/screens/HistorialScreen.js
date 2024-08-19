import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert, RefreshControl, TouchableOpacity } from 'react-native'; // Importa TouchableOpacity aquí
import * as Constantes from '../utils/constantes';
import { Ionicons } from '@expo/vector-icons';
import styles from '../estilos/HistorialScreenStyles'; // Importa los estilos desde un archivo externo
import CardHistorial from '../Componets/Cards/CardHistorial'; // Asegúrate de que la ruta sea correcta

const HistorialScreen = ({ navigation }) => {

    const [historial, setHistorial] = useState([]); // Estado para almacenar el historial
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar el estado de refrescar

    const ip = Constantes.IP; // Asegúrate de que Constantes.IP esté definido

    // Función para obtener los productos comprados desde la API
    const fetchHistorial = useCallback(async () => {
        setRefreshing(true); // Inicia el estado de refrescar
        try {
            const response = await fetch(`${ip}/FontechPriv/api/services/public/pedido.php?action=readHistorials`);
            const data = await response.json();
            if (data.status) {
                setHistorial(data.dataset); // Asegúrate de que 'dataset' contenga los productos comprados
            } else {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al obtener los datos del historial');
            console.log(error);
        } finally {
            setRefreshing(false); // Finaliza el estado de refrescar
        }
    }, [ip]);

    // Función para manejar el evento de refrescar
    const onRefresh = useCallback(() => {
        fetchHistorial(); // Vuelve a cargar los datos del historial desde la API
    }, [fetchHistorial]);

    // Efecto para cargar el historial al cargar la pantalla
    useEffect(() => {
        fetchHistorial();
    }, [fetchHistorial]);

    // Función para renderizar cada elemento del historial
    const renderHistorialItem = ({ item }) => (
        <CardHistorial
            item={item}
            onPress={() => navigation.navigate('DetallesProducto', { idProducto: item.id_producto })}
        />
    );

    return (
        <View style={styles.container}>
            {/* Título de la pantalla */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Historial de pedidos</Text>

            {/* Lista de historial usando FlatList */}
            <FlatList
                data={historial} // Cambiado a 'historial' para mostrar los productos comprados
                renderItem={renderHistorialItem} // Renderiza cada elemento de la lista
                keyExtractor={item => item.id_detalle_reserva.toString()} // Asegúrate de que el id sea una cadena
                contentContainerStyle={styles.listContainer} // Aplica estilos al contenedor de la lista
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // Estado de refrescar
                        onRefresh={onRefresh} // Función para refrescar
                    />
                }
            />
        </View>
    );
};

export default HistorialScreen;
