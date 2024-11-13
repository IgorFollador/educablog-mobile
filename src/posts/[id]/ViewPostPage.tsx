import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Post {
  titulo: string;
  descricao: string;
  imagemUrl: string;
  categoria: { nome: string };
  usuarioCriacao?: { pessoa?: { nome: string } };
}

const ViewPostPage: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { id } = route.params as { id: string };

  useEffect(() => {
    fetchPostData();
  }, []);

  const fetchPostData = async () => {
    try {
      const response = await axios.get(`${process.env.PUBLIC_API_URL}/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError('Erro ao carregar dados da postagem.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.navigate('HomePage');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {post?.titulo}
      </Text>
      {post?.imagemUrl && (
        <Image source={{ uri: post.imagemUrl }} style={styles.image} />
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.description}>{post?.descricao}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Autor</Text>
        <Text style={styles.author}>{post?.usuarioCriacao?.pessoa?.nome || 'Desconhecido'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categoria</Text>
        <Text style={styles.category}>{post?.categoria?.nome.toUpperCase()}</Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="arrow-back" size={20} color="#FFF" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 80,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
    width: '100%',
    flexShrink: 1,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  section: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  author: {
    fontSize: 16,
    color: '#333',
  },
  category: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ViewPostPage;
