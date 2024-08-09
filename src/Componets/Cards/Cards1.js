import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../estilos/DashboardScreenStyles';

const Cards1 = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={icon} size={40} color="#000" />
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Cards1;
