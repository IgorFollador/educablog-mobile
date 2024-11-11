import axios from 'axios';

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Iniciando autenticação...');
    console.log('email:', email);
    console.log('password:', password);

    const response = await axios.post(`${process.env.PUBLIC_API_URL}/autenticacao/signin`, {
      login: email,
      senha: password,
    });

    if (response.data && response.data.token) {
      console.log('Token recebido:', response.data.token);
      return { token: response.data.token };
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
