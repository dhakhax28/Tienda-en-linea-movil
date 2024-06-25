import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20, // Ajustar el espacio en la parte superior
  },
  logo: {
    width: 150,  // Ajusta el ancho de la imagen
    height: 150, // Ajusta la altura de la imagen
    resizeMode: 'contain', // O 'cover' dependiendo de cómo quieres que se ajuste la imagen
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3046BC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10, // Espacio inferior añadido para separar los elementos
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 10,
    color: '#007bff',
    fontSize: 16,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#CCCCCC',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
