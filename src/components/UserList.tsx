import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

type User = {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  dataNascimento: string;
  telefone: string;
};

interface UserListProps {
  users: User[];
  isAdmin?: boolean;
  isLoading?: boolean;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

// Função para formatar CPF
const formatCPF = (cpf: string) => {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
};

// Função para formatar telefone
const formatPhone = (phone: string) => {
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
};

// Função para formatar data
const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const UserList: React.FC<UserListProps> = ({
  users = [],
  isAdmin = false,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#4CAF50" />;
  }

  if (!Array.isArray(users) || users.length === 0) {
    return <Text style={styles.noUsersText}>Nenhum usuário encontrado.</Text>;
  }

  return (
    <View style={styles.container}>
      {users.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.userInfo}>{user.nome}</Text>
  
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.userInfo}>{user.email}</Text>
  
            <Text style={styles.label}>CPF:</Text>
            <Text style={styles.userInfo}>{formatCPF(user.cpf)}</Text>
  
            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.userInfo}>{formatPhone(user.telefone)}</Text>
  
            <Text style={styles.label}>Data de Nascimento:</Text>
            <Text style={styles.userInfo}>{formatDate(user.dataNascimento)}</Text>
          </View>
  
          {isAdmin && (
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => onEdit && onEdit(user.id)}
                style={styles.editButton}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDelete && onDelete(user.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  noUsersText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    minWidth: '100%',
  },
  infoContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
    marginTop: 4,
  },
  userInfo: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default UserList;
