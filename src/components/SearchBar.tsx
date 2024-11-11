import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Tipagem das propriedades para o SearchBar
interface SearchBarProps {
  onSearch: (query: string) => void;  // Função de busca que será chamada com o texto
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState<string>(''); // Estado local para armazenar o texto da busca

  const handleSearch = () => {
    onSearch(query); // Chama a função onSearch passando o valor atual do query
    setQuery(''); // Limpa o campo de busca após a pesquisa
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query} // O valor do TextInput é controlado pelo estado query
        onChangeText={setQuery} // Atualiza o estado query sempre que o texto mudar
        placeholder="Buscar posts..."
        style={styles.input}
      />
      <TouchableOpacity
        onPress={handleSearch} // Chama a função handleSearch ao pressionar o botão
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
