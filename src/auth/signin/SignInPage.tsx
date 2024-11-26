import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  HomePage: undefined;
  SignInPage: undefined;
  PostManagementPage: undefined;
};

type SignInPageNavigationProp = StackNavigationProp<RootStackParamList, 'SignInPage'>;

const SignInPage = () => {
  const { login, status } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<SignInPageNavigationProp>();
  const { isAdmin } = useAuth();

  // Verifica se o status de autenticação mudou e navega para a PostManagementPage
  // Quando o status mudar, navegar para PostManagementPage
  useEffect(() => {
    if (status === 'authenticated') {
      if (isAdmin()) {
        navigation.replace('PostManagementPage');
      } else {
        navigation.replace('HomePage');
      }
    }
  }, [status, navigation]);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const isAuthenticated = await login(email, password);

      if (!isAuthenticated) {
        setError('Login ou senha inválidos. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao tentar autenticar. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>EducaBlog</Text>
        </View>
        <Text style={styles.subtitle}>Painel Administrativo</Text>
        <Text style={styles.infoText}>Insira suas credenciais para acessar</Text>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignInPage;
