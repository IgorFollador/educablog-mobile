// PostDetails.tsx
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface PostDetailsProps {
  route: {
    params: {
      post: {
        titulo: string;
        descricao: string;
        imagemUrl: string;
        categoria: {
          nome: string;
        };
        usuarioCriacao: {
          pessoa: {
            nome: string;
          };
        };
      };
    };
  };
}

const PostDetails: React.FC<PostDetailsProps> = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.titulo}</Text>
      <Image source={{ uri: post.imagemUrl }} style={styles.image} />
      <Text style={styles.description}>{post.descricao}</Text>
      <Text style={styles.author}>Autor: {post.usuarioCriacao.pessoa.nome}</Text>
      <Text style={styles.category}>Categoria: {post.categoria.nome}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
    marginVertical: 8,
  },
  author: {
    fontStyle: 'italic',
  },
  category: {
    fontWeight: 'bold',
  },
});

export default PostDetails;
