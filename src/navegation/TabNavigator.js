// src/navigation/StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PasswordRecoveryScreen from '../screens/RecuperacionScreen';
import DashboardTabNavigator from './TabNavigator';
import PerfilScreen from '../screens/PerfilScreen';
import MiPerfilScreen from '../screens/MiPerfilScreen';
import ProductoScreen from '../screens/ProductoScreen';
import CarritoScreen from '../screens/CarritoScreen';
import HistorialScreen from '../screens/HistorialScreen';
import OfertasScreen from '../screens/OfertasScreen';
import TerminosCondicionesScreen from '../screens/Terminos&Condiciones';
import DetallesProductoScreen from '../screens/DetallesProductoScreen';
import PinVerificationScreen from '../screens/PinVerificationScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Onboarding' // Establece 'Sesion' como la ruta inicial
        screenOptions={{
          headerShown: false // Oculta el header por defecto
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} />
        <Stack.Screen name="PinVerificationScree" component={PinVerificationScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
        <Stack.Screen name="DashboardTabs" component={DashboardTabNavigator} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="MiPerfil" component={MiPerfilScreen} />
        <Stack.Screen name="Producto" component={ProductoScreen} />
        <Stack.Screen name="Historial" component={HistorialScreen} />
        <Stack.Screen name="Ofertas" component={OfertasScreen} />
        <Stack.Screen name="TerminosyCondiciones" component={TerminosCondicionesScreen} />
        <Stack.Screen name="DetallesProducto" component={DetallesProductoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;
