import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 70,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 250,
      height: 200,
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    input: {
      width: '80%',
      backgroundColor: '#f0f0f0',
      height: 50,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 15,
    },
    addressContainer: {
      width: '80%',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    addressInput: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      height: 50,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginRight: 10,
    },
    clearButton: {
      backgroundColor: '#ff4d4d',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    clearButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    map: {
      width: '80%',
      height: 200,
      marginBottom: 15,
    },
    registerButton: {
      backgroundColor: '#3046BC',
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 10,
      marginBottom: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    loginRedirectText: {
      color: '#007bff',
      fontSize: 16,
      textDecorationLine: 'underline',
    },
  });

  export default styles;