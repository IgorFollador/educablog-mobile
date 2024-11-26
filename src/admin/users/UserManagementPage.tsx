import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, useFocusEffect, RouteProp, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import UserList from '../../components/UserList';
import ScrollTopButton from '../../components/ScrollToTopButton';
import SearchBar from '../../components/SearchBar';

type User = {
  id: string;
  login: string;
  senha: string;
  tipo: string;
  pessoa: {
    id: string;
    cpf: string;
    nome: string;
    email: string;
    dataNascimento: string;
    telefone: string;
  };
};

type UserPageRouteProp = RouteProp<RootStackParamList, 'UserManagementPage'>;

const UserManagementPage = () => {
  const { data: session, status } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Query específica por tela
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const flatListRef = useRef<FlatList>(null);
  const { params } = useRoute<UserPageRouteProp>();
  const isProfessor = params?.isProfessor;
  const [isVisible, setIsVisible] = useState(false);

  const fetchUsers = useCallback(async (query: string = '') => {
    setLoading(true);
    setError('');
    const userTipo = isProfessor ? 'professor' : 'aluno';

    try {
      const response = await axios.get(`${process.env.PUBLIC_API_URL}/usuario/search`, {
        params: { tipo: userTipo, query: query.trim() || undefined },
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });

      setUsers(response.data || []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.status === 404
            ? 'Nenhum usuário encontrado.'
            : 'Erro ao carregar usuários. Tente novamente.';
        setError(message);
      } else {
        setError('Erro ao carregar usuários. Tente novamente.');
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [session?.token, isProfessor]);

  useFocusEffect(
    useCallback(() => {
      if (status === 'authenticated' && session?.token) {
        setSearchQuery('');
        fetchUsers();
      }
    }, [status, session?.token, fetchUsers])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchUsers(query);
  };

  const handleEdit = (userId: string) => {
    navigation.navigate('UserPage', { userId });
  };

  const handleDelete = (userId: string) => {
    Alert.alert(
      'Confirmação de exclusão',
      'Tem certeza de que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => confirmDelete(userId), style: 'destructive' },
      ]
    );
  };

  const confirmDelete = async (userId: string) => {
    try {
      await axios.delete(`${process.env.PUBLIC_API_URL}/usuario/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });

      setUsers(users.filter((user) => user.id !== userId));
      Alert.alert('Sucesso', 'Usuário excluído com sucesso.');
    } catch (err) {
      setError('Erro ao excluir. Tente novamente.');
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={{ alignItems: 'center', marginHorizontal: 16 }}>
      <UserList
        users={[item]}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </View>
  );

  const handleScroll = (event: any) => {
    const currentScrollPos = event.nativeEvent.contentOffset.y;
    setIsVisible(currentScrollPos > 200); // Botão aparece após rolar 200px
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Text style={styles.title}>
              Gerenciamento de {isProfessor ? 'Professores' : 'Alunos'}
            </Text>
            <SearchBar onSearch={handleSearch} />
            {error && <Text style={styles.errorText}>{error}</Text>}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </View>
        }
        ListFooterComponent={<View style={{ height: 60 }} />}
        ListEmptyComponent={
          !loading && !users.length ? (
            <Text style={styles.errorText}>Nenhum usuário encontrado.</Text>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 50 }}
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

export default UserManagementPage;
