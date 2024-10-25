import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Post = {
  id: string;
  titulo: string;
  descricao: string;
  imagemUrl?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  categoria?: {
    id: string;
    nome: string;
  };
  usuarioCriacao?: {
    id: string;
    login: string;
    pessoa?: {
      id: string;
      nome: string;
    };
  };
};

interface PostListProps {
  posts: Post[];
  isAdmin?: boolean;
  isLoading?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  posts = [],
  isAdmin = false,
  isLoading = false,
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const navigation = useNavigation();

  const handlePostClick = (post: Post) => {
    navigation.navigate('PostDetails', { post });
  };

  const removeHtmlTags = (description: string) => {
    return description.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const truncateDescription = (description: string, length: number) => {
    const plainTextDescription = removeHtmlTags(description);
    return plainTextDescription.length > length
      ? `${plainTextDescription.substring(0, length)}...`
      : plainTextDescription;
  };

  if ((!Array.isArray(posts) || posts.length === 0) && !isLoading) {
    return <Text style={styles.noPostsText}>Nenhuma postagem encontrada.</Text>;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(post) => post.id}
      renderItem={({ item: post }) => (
        <TouchableOpacity
          style={styles.postContainer}
          onPress={() => handlePostClick(post)}
        >
          <Text style={styles.title}>{post.titulo}</Text>
          <Text style={styles.description}>
            {truncateDescription(post.descricao, 150)}
          </Text>
          {post.imagemUrl && (
            <Image source={{ uri: post.imagemUrl }} style={styles.image} />
          )}
          <Text style={styles.details}>
            {post.categoria && `Categoria: ${post.categoria.nome.toUpperCase()}`}
            {post.usuarioCriacao?.pessoa?.nome && ` | Autor: ${post.usuarioCriacao.pessoa.nome.toUpperCase()}`}
          </Text>
          <Text style={styles.date}>
            Publicado em: {new Date(post.dataCriacao).toLocaleDateString()}
          </Text>

          {isAdmin && (
            <View style={styles.actionsContainer}>
              <View
                style={[styles.statusDot, post.ativo ? styles.activeDot : styles.inactiveDot]}
              >
                {showTooltip === post.id && (
                  <Text style={styles.tooltip}>
                    {post.ativo ? 'Ativo' : 'Inativo'}
                  </Text>
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  noPostsText: { textAlign: 'center', marginTop: 20 },
  postContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  description: { marginBottom: 12 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 8 },
  details: { fontStyle: 'italic', color: '#666', marginBottom: 4 },
  date: { fontSize: 12, color: '#999' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  activeDot: { backgroundColor: 'green' },
  inactiveDot: { backgroundColor: 'red' },
  tooltip: { position: 'absolute', top: -20, backgroundColor: '#333', color: 'white', padding: 4, borderRadius: 4, fontSize: 10 },
});

export default PostList;
