import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import PostList from '../../components/PostList';
import SearchBar from '../../components/SearchBar';
import ScrollTopButton from '../../components/ScrollToTopButton';

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

const PostManagementPage = () => {
  const { data: session, status } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Controle para evitar múltiplas chamadas
  const isFetching = useRef(false);

  // Função para buscar posts
  const fetchPosts = useCallback(
    async (page: number, query: string = '') => {
      if (!session?.token || isFetching.current || loading) return; // Previne chamadas desnecessárias

      isFetching.current = true;
      setLoading(true);
      setError('');
      const postsLimit = '10';

      try {
        const endpoint = query
          ? `${process.env.PUBLIC_API_URL}/posts/admin/search`
          : `${process.env.PUBLIC_API_URL}/posts/admin`;
        const response = await axios.get(endpoint, {
          params: { query, limite: parseInt(postsLimit, 10), pagina: page },
          headers: { Authorization: `Bearer ${session.token}` },
        });

        setPosts(response.data || []);
        setTotalPages(Math.ceil(response.headers['x-total-count'] / parseInt(postsLimit, 10)));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const message =
            err.response?.status === 404
              ? 'Nenhum post encontrado.'
              : 'Erro ao carregar posts. Tente novamente.';
          setError(message);
        } else {
          setError('Erro ao carregar posts. Tente novamente.');
        }
        setPosts([]);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    [session?.token, loading] // Apenas depende do token da sessão e do estado de carregamento
  );

  // Atualiza os posts apenas uma vez ao iniciar
  useEffect(() => {
    if (status === 'authenticated' && session?.token) {
      fetchPosts(currentPage, searchQuery);
    }
  }, [status, session?.token, currentPage, searchQuery]); // Mantém apenas dependências necessárias

  // Listener para recarregar posts ao voltar para a tela
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (status === 'authenticated' && session?.token && !isFetching.current) {
        fetchPosts(currentPage, searchQuery);
      }
    });

    return unsubscribe;
  }, [navigation, session?.token, status, currentPage, searchQuery]); // Reduz dependências desnecessárias

  // Função de exclusão de posts
  const handleDelete = (postId: string) => {
    Alert.alert(
      "Confirmação de exclusão",
      "Tem certeza de que deseja excluir esta postagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              setLoading(true);
              await axios.delete(`${process.env.PUBLIC_API_URL}/posts/${postId}`, {
                headers: { Authorization: `Bearer ${session?.token}` },
              });
              setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            } catch {
              setError('Erro ao deletar postagem. Verifique sua conexão e tente novamente.');
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    setSearchQuery(query);
  };

  const handleScroll = (event: any) => {
    setIsVisible(event.nativeEvent.contentOffset.y > 200);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={{ alignItems: 'center', marginHorizontal: 16 }}>
      <PostList
        posts={[item]}
        isLoading={loading}
        onEdit={(postId) => navigation.navigate('PostPage', { postId })}
        onDelete={() => handleDelete(item.id)}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Text style={styles.title}>Administração de Postagens</Text>
            <SearchBar onSearch={handleSearch} />
            {error && <Text style={styles.errorText}>{error}</Text>}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </View>
        }
        ListEmptyComponent={
          !loading && !posts.length && <Text style={styles.errorText}>Nenhum post encontrado.</Text>
        }
        ListFooterComponent={<View style={{ height: 60 }} />}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <ScrollTopButton isVisible={isVisible} scrollToTop={scrollToTop} />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default PostManagementPage;
