import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // light grey background color for a modern look
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // dark grey color for the title
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  grid: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: '99%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 33,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 75,
    height: 75,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});

export default styles;
