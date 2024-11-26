import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

export const signIn = async (email: string, password: string) => {
  try {
    const apiUrl = Constants.expoConfig.extra.PUBLIC_API_URL;

    const response = await axios.post(`${apiUrl}/autenticacao/signin`, {
      login: email,
      senha: password,
    });

    console.log('Resposta do servidor (signIn):', response.data);

    if (response.data && response.data.token) {
      const { token, refreshToken, tipo } = response.data;

      // Armazenando o token e o refreshToken no AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('refreshToken', refreshToken || '');

      return { token, tipo, refreshToken: refreshToken || ''};
    } else {
      console.warn('Token ou refreshToken não encontrados na resposta de login');
      return null;
    }
  } catch (error: any) {
    console.error('Erro de autenticação (signIn):', error.response?.data || error.message);
    return null;
  }
};

export const signOut = async () => {
  try {
    console.log('Usuário desconectado');
    await AsyncStorage.multiRemove(['token', 'refreshToken']);
  } catch (error: any) {
    console.error('Erro ao realizar logout:', error.message);
  }
};

export const verifyToken = async (token: string) => {
  try {
    const apiUrl = Constants.expoConfig.extra.PUBLIC_API_URL;

    console.log('Verificando token:', token);

    const response = await axios.post(
      `${apiUrl}/autenticacao/verify-token`,
      { token },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Resposta ao verificar token:', response.data);

    return response.status === 200 && response.data.valid;
  } catch (error: any) {
    console.error('Erro ao verificar token:', error.response?.data || error.message);
    return false;
  }
};

export const refreshAccessToken = async () => {
  try {
    const apiUrl = Constants.expoConfig.extra.PUBLIC_API_URL;

    // Recuperando o refreshToken do AsyncStorage
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.warn('Nenhum refreshToken encontrado no armazenamento');
      return null;
    }

    console.log('Tentando renovar o token com refreshToken:', refreshToken);

    const response = await axios.post(
      `${apiUrl}/autenticacao/refresh-token`,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Resposta ao renovar o token:', response.data);

    if (response.status === 200 && response.data.accessToken) {
      const newToken = response.data.accessToken;

      console.log('Token renovado com sucesso:', newToken);

      // Armazenando o novo token no AsyncStorage
      await AsyncStorage.setItem('token', newToken);
      return newToken;
    } else {
      console.warn('Falha ao renovar token, resposta do servidor:', response.data);
      return null;
    }
  } catch (error: any) {
    console.error('Erro ao renovar o token:', error.response?.data || error.message);
    return null;
  }
};

export const manageToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.warn('Nenhum token encontrado, tentando renovar...');
      return await refreshAccessToken();
    }

    const isValid = await verifyToken(token);

    if (isValid) {
      console.log('Token válido:', token);
      return token;
    } else {
      console.warn('Token inválido, tentando renovar...');
      return await refreshAccessToken();
    }
  } catch (error: any) {
    console.error('Erro ao gerenciar token:', error.message);
    return null;
  }
};
