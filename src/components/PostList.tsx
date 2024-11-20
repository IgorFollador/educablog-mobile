import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image, FlatList, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

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
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts = [],
  isAdmin = false,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePostClick = (postId: string) => {
    console.log('Clicou no post:', postId);
    navigation.navigate('ViewPostPage', { id: postId, isAdmin });
  };

  const removeHtmlTags = (description: string) => {
    return description.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const truncateDescription = (description: string, length: number) => {
    const plainTextDescription = removeHtmlTags(description);
    if (plainTextDescription.length > length) {
      return (
        <>
          {plainTextDescription.substring(0, length)}...
          <Text style={styles.moreText}> Para mais, acesse o post.</Text>
        </>
      );
    }
    return plainTextDescription;
  };

  if ((!Array.isArray(posts) || posts.length === 0) && !isLoading) {
    return <Text>Nenhuma postagem encontrada.</Text>;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={isLoading ? <Text style={styles.loadingText}>Carregando Postagens...</Text> : null}
      renderItem={({ item: post }) => (
        <TouchableOpacity
          onPress={() => handlePostClick(post.id)}
          style={styles.postContainer}
        >
          <Text style={styles.postTitle}>{post.titulo}</Text>
          <Text style={styles.postDescription}>{truncateDescription(post.descricao, 150)}</Text>

          {post.imagemUrl && (
            <Image
              source={{ uri: post.imagemUrl }}
              style={styles.postImage}
            />
          )}

          <Text style={styles.postCategory}>
            {post.categoria && <>Categoria: {post.categoria.nome.toUpperCase()}</>}
            {post.usuarioCriacao?.pessoa?.nome && (
              <>
                {post.categoria ? ' | ' : ''}
                Autor: {post.usuarioCriacao.pessoa.nome.toUpperCase()}
              </>
            )}
          </Text>
          <Text style={styles.postDate}>
            Publicado em: {new Date(post.dataCriacao).toLocaleDateString()}
          </Text>

          {isAdmin && (
            <View style={styles.adminActionsContainer}>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  onPress={() => onEdit && onEdit(post.id)}
                  style={[styles.actionButton, styles.editButton]}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete && onDelete(post.id)}
                  style={[styles.actionButton, styles.deleteButton]}
                >
                  <Text style={styles.buttonText}>Deletar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statusIndicatorContainer}>
                <View
                  style={[styles.statusIndicator, post.ativo ? styles.activeStatus : styles.inactiveStatus]}
                />
                {showTooltip === post.id && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>{post.ativo ? 'Ativo' : 'Inativo'}</Text>
                  </View>
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
  postContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postDescription: {
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postCategory: {
    fontStyle: 'italic',
    color: '#4B5563',
  },
  postDate: {
    color: '#6B7280',
  },
  adminActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
  },
  statusIndicatorContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  activeStatus: {
    backgroundColor: '#10B981',
  },
  inactiveStatus: {
    backgroundColor: '#EF4444',
  },
  tooltip: {
    position: 'absolute',
    bottom: 30,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#4B5563',
    borderRadius: 4,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  moreText: {
    color: '#3B82F6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loadingText: {
    textAlign: 'center',
  },
});

export default PostList;
