import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Deu certo aqui</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default AdminPage;
