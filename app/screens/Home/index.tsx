// Home/index.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Header from '@/components/shared/Header';
import PostList from '@/components/PostList';

const Home: React.FC = () => {
  const posts = [
    {
      id: '1',
      titulo: 'Primeiro Post',
      descricao: 'Esta é a descrição do primeiro post.',
      imagemUrl: 'https://example.com/image1.jpg',
      ativo: true,
      dataCriacao: '2024-10-01',
      dataAtualizacao: '2024-10-01',
      categoria: { id: '1', nome: 'Categoria 1' },
      usuarioCriacao: { id: '1', login: 'usuario1', pessoa: { id: '1', nome: 'Autor 1' } },
    },
    {
      id: '2',
      titulo: 'Segundo Post',
      descricao: 'Descrição do segundo post, que é mais detalhada.',
      imagemUrl: 'https://example.com/image2.jpg',
      ativo: false,
      dataCriacao: '2024-10-05',
      dataAtualizacao: '2024-10-05',
      categoria: { id: '2', nome: 'Categoria 2' },
      usuarioCriacao: { id: '2', login: 'usuario2', pessoa: { id: '2', nome: 'Autor 2' } },
    },
  ];

  const isLoading = false;

  return (
    <View style={styles.screenContainer}>
      <Header title="EducaBlog" />

      <View style={styles.container}>
        <Text style={styles.header}>Lista de Postagens</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <PostList posts={posts} isAdmin={true} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
});

export default Home;
