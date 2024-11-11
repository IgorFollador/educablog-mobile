import { useState, useEffect } from 'react';
import { Text, ActivityIndicator, FlatList, View, StyleSheet } from 'react-native';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import PostList from '../components/PostList';
import { formatDate } from '../services/Utils';

type Post = {
  id: string;
  titulo: string;
  descricao: string;
  imagemUrl?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
};

// Tipo ListItem agora trata postagens e cabeçalhos com 'key' e 'component'
type ListItem = Post | { key: string; component: boolean };

const HomePage = () => {
  const [lastUpdate, setLastUpdate] = useState<string>(' --/--/---- --:--:--');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async (query = '') => {
    const apiUrl = process.env.PUBLIC_API_URL;
    const postsLimit = process.env.POSTS_LIMIT || '10';

    if (!apiUrl) {
      setError('A URL da API não está definida corretamente. Verifique as variáveis de ambiente.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = query
        ? await axios.get(`${apiUrl}/posts/search`, {
            params: {
              query,
              limite: parseInt(postsLimit, 10),
              pagina: currentPage,
            },
          })
        : await axios.get(`${apiUrl}/posts`, {
            params: {
              limite: parseInt(postsLimit, 10),
              pagina: currentPage,
            },
          });

      setLastUpdate(formatDate(new Date()));
      setPosts(response.data);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / parseInt(postsLimit, 10)));
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          if (err.response.status === 404) {
            setPosts([]);
            setTotalPages(0);
            setError('Nenhum post encontrado.');
          } else {
            setError(`Erro: ${err.response.status} - ${err.response.statusText}`);
          }
        } else if (err.request) {
          setError('Não foi possível obter resposta da API. Verifique a conectividade e as configurações de rede.');
        } else {
          setError(`Erro ao configurar a requisição: ${err.message}`);
        }
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    fetchPosts(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <FlatList
      data={[{ key: 'header', component: true }, ...posts]}  // Aqui você mistura postagens com um item de cabeçalho
      keyExtractor={(item, index) => (('key' in item) ? item.key : String(index))}  // Verifica se 'key' existe no item
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Postagens</Text>
          <Text style={styles.updateText}>Última atualização {lastUpdate}</Text>
          <SearchBar onSearch={handleSearch} />

          {loading && (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          )}
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>
      }
      renderItem={({ item }: { item: ListItem }) => {
        if ('component' in item && item.component) {  // Verifica se o item tem a propriedade 'component'
          return <View style={{ alignItems: 'center', marginHorizontal: 16 }}><PostList posts={posts} isLoading={loading} /></View>;
        }
        return null;
      }}
      ListFooterComponent={<View style={{ height: 60 }} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  updateText: {
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 16,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default HomePage;
