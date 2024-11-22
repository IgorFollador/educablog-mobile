import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import UserList from '../../components/UserList';
import Pagination from '../../components/Pagination';

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
  }
};

const UserManagementPage = () => {
  const { data: session, status } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchUsers = useCallback(async (page: number, query: string = '') => {
    setLoading(true);
    setError('');
    const usersLimit = '10';

    try {
      const response = await axios.get(`${process.env.PUBLIC_API_URL}/usuario`, {
        params: { query, limite: parseInt(usersLimit, 10), pagina: page },
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      setTotalPages(Math.ceil(response.headers['x-total-count'] / parseInt(usersLimit, 10)));
      setUsers(response.data.usuarios || []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError('Erro ao carregar os usuários.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    if (status === 'authenticated' && session?.token) {
      fetchUsers(currentPage, searchQuery);
    }
  }, [session, status, currentPage, searchQuery, fetchUsers]);

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    setSearchQuery(query);
  };

  const handleEdit = (userId: string) => {
    navigation.navigate('UserPage', { userId });
  };

  const handleDelete = (userId: string) => {
    Alert.alert(
      "Confirmação de exclusão",
      "Tem certeza de que deseja excluir este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => confirmDelete(userId), style: "destructive" }
      ]
    );
  };

  const confirmDelete = async (userId: string) => {
    try {
      console.log('Excluindo usuario: ', userId);
      await axios.delete(`${process.env.PUBLIC_API_URL}/usuario/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });

      setUsers(users.filter((user) => user.id !== userId));
      Alert.alert('Sucesso', 'Usuário excluído com sucesso.');

    } catch (err) {
      console.error('Erro ao deletar postagem:', err.response.data);
      setError('Erro ao deletar postagem. Verifique sua conexão e tente novamente.');
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={{ alignItems: 'center', marginHorizontal: 16 }}>
      <UserList
        users={[item]}
        isAdmin
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </View>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={{ padding: 16 }}>
          <Text style={styles.title}>Gerenciamento de Usuários</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      }
      ListFooterComponent={
        !loading && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )
      }
      ListEmptyComponent={!loading && !users.length ? <Text style={styles.errorText}>Nenhum usuário encontrado</Text> : null}
      contentContainerStyle={{ paddingBottom: 50 }}
    />
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
