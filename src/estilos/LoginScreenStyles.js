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
    width: 225,  // Reducción del tamaño original de 150 a 120
    height: 75, // Reducción del tamaño original de 150 a 120
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
  passwordContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  button: {
    backgroundColor: '#3046BC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
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
    marginTop: 20,
  },
});

export default styles;
