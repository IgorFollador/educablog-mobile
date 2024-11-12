import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import PostList from '../components/PostList';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import Icon from 'react-native-vector-icons/FontAwesome';

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
};

const AdminPage = () => {
  const { data: session, status } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showActionsDrawer, setShowActionsDrawer] = useState<boolean>(false); // Estado para controlar o drawer de ações
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation();

  const fetchPosts = useCallback(async (page: number, query: string = '') => {
    setLoading(true);
    setError('');
    const postsLimit = '10';

    try {
      const response = query
        ? await axios.get(`${process.env.PUBLIC_API_URL}/posts/admin/search`, {
            params: { query, limite: parseInt(postsLimit, 10), pagina: page },
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          })
        : await axios.get(`${process.env.PUBLIC_API_URL}/posts/admin`, {
            params: { limite: parseInt(postsLimit, 10), pagina: page },
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          });

      setPosts(response.data);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / parseInt(postsLimit, 10)));
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
      setError('Erro ao carregar as postagens.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    if (status === 'authenticated' && session?.token) {
      fetchPosts(currentPage, searchQuery);
    }
  }, [session, status, currentPage, searchQuery, fetchPosts]);

  const handleEdit = (postId: string) => {
    navigation.navigate('EditPostPage', { postId });
  };

  const handleDelete = (postId: string) => {
    setSelectedPostId(postId);
    Alert.alert(
      "Confirmação de exclusão",
      "Tem certeza de que deseja excluir esta postagem?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: confirmDelete, style: "destructive" }
      ]
    );
  };

  const confirmDelete = async () => {
    if (selectedPostId) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${selectedPostId}`, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });

        setPosts(posts.filter((post) => post.id !== selectedPostId));
      } catch (err) {
        console.error('Erro ao deletar postagem:', err);
        setError('Erro ao deletar postagem. Verifique sua conexão e tente novamente.');
      }
    }
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    setSearchQuery(query);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>

      <Text style={styles.title}>Administração de Postagens</Text>
      <SearchBar onSearch={handleSearch} />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <PostList posts={posts} isLoading={loading} isAdmin onEdit={handleEdit} onDelete={handleDelete} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {/* Modal para o Drawer de Ações Administrativas */}
      <Modal
        visible={showActionsDrawer}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowActionsDrawer(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.drawerTitle}>Ações Administrativas</Text>
            <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('CreatePostPage')}>
              <Icon name="file-text" style={styles.icon} />
              <Text style={styles.drawerItemText}>ADICIONAR POST</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('CreateUserPage')}>
              <Icon name="user-plus" style={styles.icon} />
              <Text style={styles.drawerItemText}>ADICIONAR USUÁRIO</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowActionsDrawer(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  drawerTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  drawerItemText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    color: '#333',
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
  },
});

export default AdminPage;
