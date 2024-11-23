import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn as authenticate, signOut as logOut } from '../services/AuthService';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface AuthContextType {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  initializing: boolean;
  isAdmin: () => boolean;
  data: { token: string; tipo: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [initializing, setInitializing] = useState<boolean>(true);
  const [data, setData] = useState<{ token: string; tipo: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const tipo = (await AsyncStorage.getItem('userTipo')) || 'default'; // Valor padrão para `tipo`

      if (token) {
        setStatus('authenticated');
        setData({ token, tipo });
      } else {
        setStatus('unauthenticated');
      }

      setInitializing(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Garantindo o tipo de retorno
    const success: { token: string; tipo?: string } | null = await authenticate(email, password);

    if (success) {
      const { token, tipo = 'default' } = success; // Valor padrão para `tipo`
      setStatus('authenticated');
      setData({ token, tipo });
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userTipo', tipo);
      return true;
    } else {
      setStatus('unauthenticated');
      return false;
    }
  };

  const logout = async () => {
    await logOut();
    setStatus('unauthenticated');
    setData(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userTipo');
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const isAdmin = () => data?.tipo === 'professor';
  const isAuthenticated = status === 'authenticated';

  return (
    <AuthContext.Provider value={{ status, initializing, isAdmin, data, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('UseAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003366',
  },
});
