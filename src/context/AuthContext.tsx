import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn as authenticate, signOut as logOut, verifyToken, refreshAccessToken } from '../services/AuthService';
import { ActivityIndicator, View, Alert, StyleSheet } from 'react-native';

interface AuthContextType {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  initializing: boolean;
  isAdmin: () => boolean;
  data: { token: string; tipo: string; refreshToken: string; tokenExpiration: number } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAndRefreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [initializing, setInitializing] = useState<boolean>(true);
  const [data, setData] = useState<{ token: string; tipo: string; refreshToken: string; tokenExpiration: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const TOKEN_EXPIRATION_TIME = parseInt(process.env.TOKEN_EXPIRATION_TIME || '86400000', 10); // 24 horas em ms
  const REFRESH_INTERVAL = TOKEN_EXPIRATION_TIME * 0.1; // 10% do tempo de expiração

  const checkAndRefreshToken = async () => {
    console.log('Verificando necessidade de renovação do token...');
    if (!data?.token || isRefreshing) {
      console.log('Renovação não necessária ou já em andamento.');
      return;
    }
  
    const currentTime = Date.now();
    const expirationTime = parseInt((await AsyncStorage.getItem('tokenExpiration')) || '0', 10);
  
    console.log('Dados do token:', { currentTime, expirationTime });
  
    if (expirationTime === 0) {
      console.log('Token de expiração não encontrado.');
      return;
    }
  
    const timeUntilExpiration = expirationTime - currentTime;
  
    console.log('Tempo até a expiração:', timeUntilExpiration);
  
    if (timeUntilExpiration <= 0 || timeUntilExpiration <= REFRESH_INTERVAL) {
      console.log('Token está próximo da expiração. Tentando renovar...');
      setIsRefreshing(true);
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          const newExpirationTime = currentTime + TOKEN_EXPIRATION_TIME;
  
          setData(prevState =>
            prevState
              ? { ...prevState, token: newAccessToken, tokenExpiration: newExpirationTime }
              : { token: newAccessToken, tipo: 'default', refreshToken: '', tokenExpiration: newExpirationTime },
          );
  
          await AsyncStorage.setItem('userToken', newAccessToken);
          await AsyncStorage.setItem('tokenExpiration', newExpirationTime.toString());
          console.log('Token renovado com sucesso.');
        } else {
          console.log('Falha ao renovar o token.');
          await logout();
          Alert.alert('Sessão expirada', 'Por favor, faça login novamente.');
        }
      } catch (error) {
        console.log('Erro ao renovar o token:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Iniciando verificação de autenticação...');
      const token = await AsyncStorage.getItem('userToken');
      const refreshToken = await AsyncStorage.getItem('userRefreshToken');
      const tipo = (await AsyncStorage.getItem('userTipo')) || 'default';
      const tokenExpiration = parseInt((await AsyncStorage.getItem('tokenExpiration')) || '0', 10);
  
      console.log('Dados armazenados:', { token, refreshToken, tipo, tokenExpiration });
  
      if (token) {
        console.log('Token encontrado. Validando...');
        const isTokenValid = await verifyToken(token);
        console.log('Token válido?', isTokenValid);
  
        if (isTokenValid) {
          setData({ token, tipo, refreshToken: refreshToken || '', tokenExpiration });
          setStatus('authenticated');
          console.log('Usuário autenticado com sucesso.');
        } else if (refreshToken) {
          console.log('Token expirado. Tentando renovar com refresh token...');
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            const newExpirationTime = Date.now() + TOKEN_EXPIRATION_TIME;
            setData({ token: newAccessToken, tipo, refreshToken, tokenExpiration: newExpirationTime });
            await AsyncStorage.setItem('userToken', newAccessToken);
            await AsyncStorage.setItem('tokenExpiration', newExpirationTime.toString());
            setStatus('authenticated');
            console.log('Token renovado com sucesso.');
          } else {
            console.log('Erro ao renovar o token. Definindo status como não autenticado.');
            setStatus('unauthenticated');
          }
        } else {
          console.log('Nenhum refresh token disponível. Usuário não autenticado.');
          setStatus('unauthenticated');
        }
      } else {
        console.log('Nenhum token encontrado. Usuário não autenticado.');
        setStatus('unauthenticated');
      }
      setInitializing(false);
    };
  
    checkAuth();
  
    const intervalId = setInterval(() => {
      if (status === 'authenticated') {
        console.log('Verificando necessidade de renovar o token...');
        checkAndRefreshToken();
      }
    }, REFRESH_INTERVAL);
  
    return () => clearInterval(intervalId);
  }, [status]);

  const login = async (email: string, password: string) => {
    console.log('Tentando login com email:', email);
    try {
      const response = await authenticate(email, password);
      console.log('Resposta do serviço de autenticação:', response);
  
      if (response && response.token) {
        const { token, tipo = 'default', refreshToken } = response;
        const expirationTime = Date.now() + TOKEN_EXPIRATION_TIME;
  
        setData({ token, tipo, refreshToken, tokenExpiration: expirationTime });
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userTipo', tipo);
        await AsyncStorage.setItem('userRefreshToken', refreshToken);
        await AsyncStorage.setItem('tokenExpiration', expirationTime.toString());
  
        console.log('Login bem-sucedido. Dados armazenados.');
        setStatus('authenticated');
        return true;
      }
    } catch (error) {
      console.log('Erro no login:', error);
    }
  
    Alert.alert('Erro', 'Falha no login. Por favor, tente novamente.');
    console.log('Login falhou. Definindo status como não autenticado.');
    setStatus('unauthenticated');
    return false;
  };

  const logout = async () => {
    console.log('Deslogando...');
    await AsyncStorage.multiRemove(['userToken', 'userTipo', 'userRefreshToken', 'tokenExpiration']);
    setData(null);
    setStatus('unauthenticated');
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const isAdmin = () => data?.tipo === 'professor';

  return (
    <AuthContext.Provider value={{ status, initializing, isAdmin, data, login, logout, checkAndRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
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