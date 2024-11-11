import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <TextInput
        value=""
        onChangeText={() => {}}
        placeholder="Buscar posts..."
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => {}}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 8,
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
