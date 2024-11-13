import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn as authenticate, signOut as logOut } from '../services/AuthService';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface AuthContextType {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  initializing: boolean;
  data: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [initializing, setInitializing] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setStatus('authenticated');
        setData({ token });
      } else {
        setStatus('unauthenticated');
      }

      setInitializing(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const success = await authenticate(email, password);
    if (success) {
      setStatus('authenticated');
      setData({ token: success.token });
      await AsyncStorage.setItem('userToken', success.token);
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
  };

  // Exibe o indicador de carregamento do AuthContext
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ status, initializing, data, login, logout }}>
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
