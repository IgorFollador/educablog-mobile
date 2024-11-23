import axios from 'axios';
import Constants from 'expo-constants';

export const signIn = async (email: string, password: string) => {
  try {
    const apiUrl = Constants.expoConfig.extra.PUBLIC_API_URL;

    console.log('Iniciando autenticação...');
    console.log('email:', email);
    console.log('password:', password);

    const response = await axios.post(`${apiUrl}/autenticacao/signin`, {
      login: email,
      senha: password,
    });

    if (response.data && response.data.token) {
      console.log('Token recebido:', response.data.token);
      console.log('Tipo Usuário recebido:', response.data.tipo);
      return { token: response.data.token, tipo: response.data.tipo };
    } else {
      console.log('Autenticação falhou: Nenhum token retornado');
      return null;
    }
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return null;
  }
};

export const signOut = async () => {
  console.log('Usuário desconectado');
};
