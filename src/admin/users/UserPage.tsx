import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';  // Importando o Picker
import { ScrollView } from 'react-native-gesture-handler';

type UserPageNavigationProp = NavigationProp<RootStackParamList, 'UserPage'>;
type UserPageRouteProp = RouteProp<RootStackParamList, 'UserPage'>;

const UserPage = () => {
  const { params } = useRoute<UserPageRouteProp>();
  const navigation = useNavigation<UserPageNavigationProp>();
  const { userId } = params || {};
  const [pessoaId, setPessoaId] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [tipo, setTipo] = useState<string>('aluno');  // Inicializa com 'aluno'
  const [email, setEmail] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [cpf, setCPF] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [dataNascimento, setDataNascimento] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validação com Zod
  const userSchema = z.object({
    login: z.string().nonempty('Login é obrigatório'),
    senha: z.string().nonempty('Senha é obrigatória'),
    tipo: z.enum(['aluno', 'professor', 'admin']),
    pessoa: z.object({
      id: z.string().optional().nullable(),
      email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
      nome: z.string().nonempty('Nome é obrigatório'),
      cpf: z.string().nonempty('CPF deve ter 11 dígitos'),
      telefone: z.string().nonempty('Telefone inválido'),
      dataNascimento: z.string().nonempty('Data de nascimento é obrigatória'),
    }),
  });  

  const formatCPF = (cpf: string) => {
    if (!cpf) return 'N/A'
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return 'N/A'
    return phone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatDate = (date: string) => {
    if (!date) return '';
  
    // Verifica se a data está no formato yyyy-MM-dd
    if (date.includes('-')) {
      const [year, month, day] = date.split('-');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
  
    // Caso seja um input sendo digitado (dd/MM/yyyy)
    let value = date.replace(/\D/g, '');
  
    if (value.length <= 2) {
      value = value.replace(/(\d{2})/, '$1');
    } else if (value.length <= 4) {
      value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
    } else {
      value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
  
    return value;
  };
  

  const handleCPFChange = (value: string) => setCPF(formatCPF(value));
  const handlePhoneChange = (value: string) => setTelefone(formatPhone(value));
  const handleDateChange = (value: string) => setDataNascimento(formatDate(value));

  const cleanCPF = (cpf: string) => cpf.replace(/\D/g, '');
  const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

  const formatDateToAPI = (date: string) => {
    if (!date) return '';
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true); 
  
    const formattedDate = formatDateToAPI(dataNascimento);
  
    const userData = {
      login,
      senha,
      tipo,
      pessoa: {
        id: pessoaId || null, 
        cpf: cleanCPF(cpf),
        nome,
        email,
        dataNascimento: formattedDate,
        telefone: cleanPhone(telefone),
      },
    };
  
    const validation = userSchema.safeParse(userData);
  
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message).join(', ');
      setError(errors); 
      setLoading(false);
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Você precisa estar autenticado para criar ou editar uma postagem.');
        setLoading(false);
        return;
      }

      let result;
  
      if (userId) {
        console.log('Chamou o alterar:', validation.data);

        // Se existir um userId, estamos editando
        result = await axios.put(
          `${process.env.PUBLIC_API_URL}/usuario/${userId}`, validation.data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        console.log('Chamou o criar:', validation.data);

        // Se não existir userId, estamos criando um novo usuário
        result = await axios.post(
          `${process.env.PUBLIC_API_URL}/usuario`, validation.data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
  
      setLoading(false);
  
      if (result.status === 201) {
        Alert.alert('Sucesso', 'Usuário criado com sucesso!');
        
        // Limpar os campos:
        setPessoaId('');
        setLogin('');
        setSenha('');
        setTipo('aluno');
        setEmail('');
        setNome('');
        setCPF('');
        setTelefone('');
        setDataNascimento('');
      }
  
      if (result.status === 200) {
        Alert.alert('Sucesso', 'Usuário atualizado com sucesso.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (err) {
      setLoading(false); // Em caso de erro, definimos loading como falso
  
      if (axios.isAxiosError(err)) {
        // Aqui garantimos que os erros de resposta (status) sejam tratados corretamente
        if (err.response) {
          switch (err.response.status) {
            case 400:
              setError('Dados inválidos. Verifique os campos e tente novamente.');
              break;
            case 409:
              setError('Erro: Este email já está em uso.');
              break;
            case 500:
              console.log('Erro no servidor:', err.response.data);
              setError('Erro no servidor. Por favor, tente novamente mais tarde.');
              break;
            default:
              console.log('Erro no desconhecido:', err.response.data);
              setError('Erro desconhecido. Por favor, tente novamente.');
          }
        } else if (err.request) {
          // Caso haja problemas de rede ou não obtenha resposta do servidor
          setError('Erro na conexão. Verifique sua internet e tente novamente.');
        } else {
          // Outros erros desconhecidos
          setError(`Erro desconhecido: ${err.message}`);
        }
      } else {
        // Caso o erro não seja do axios
        setError('Erro desconhecido. Por favor, tente novamente.');
      }
    }
  };  

  const handleCancel = () => {
    navigation.goBack(); // Volta para a página anterior
  };

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setLoading(true);
        setError('');
        
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
            setLoading(false); // Se não houver token, encerre o loading
            return;
          }
    
          const response = await axios.get(`${process.env.PUBLIC_API_URL}/usuario/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          const user = response.data;
  
          setPessoaId(user.pessoa.id || '');
          setLogin(user.login || '');
          setSenha(user.senha || ''); // Preenchendo corretamente a senha
          setTipo(user.tipo || 'aluno');
          setEmail(user.pessoa.email || '');
          setNome(user.pessoa.nome || '');
          setCPF(formatCPF(user.pessoa.cpf || ''));
          setTelefone(formatPhone(user.pessoa.telefone || ''));
          setDataNascimento(formatDate(user.pessoa.dataNascimento || ''));
    
        } catch (err) {
          console.error('Erro ao carregar os dados do usuário:', err);
          setError('Erro ao carregar os dados do usuário.');
        } finally {
          setLoading(false); // Garantir que o loading seja desligado após o fetch
        }
      };
    
      fetchUser();
    }
  }, [userId]);  

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Editar Usuário</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={[styles.input, focusedField === 'login' && styles.focusedInput]}
            placeholder="Login"
            value={login}
            onChangeText={setLogin}
            onFocus={() => setFocusedField('login')}
            onBlur={() => !login && setFocusedField(null)}
          />

          <TextInput
            style={[styles.input, focusedField === 'senha' && styles.focusedInput]}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            onFocus={() => setFocusedField('senha')}
            onBlur={() => !senha && setFocusedField(null)}
          />

          <TextInput
            style={[styles.input, focusedField === 'email' && styles.focusedInput]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField('email')}
            onBlur={() => !email && setFocusedField(null)}
            keyboardType="email-address"
          />

          <TextInput
            style={[styles.input, focusedField === 'nome' && styles.focusedInput]}
            placeholder="Nome Completo"
            value={nome}
            onChangeText={setNome}
            onFocus={() => setFocusedField('name')}
            onBlur={() => !nome && setFocusedField(null)}
          />

          <TextInput
            style={[styles.input, focusedField === 'cpf' && styles.focusedInput]}
            placeholder="CPF"
            value={cpf}
            onChangeText={handleCPFChange}
            onFocus={() => setFocusedField('cpf')}
            onBlur={() => !cpf && setFocusedField(null)}
            maxLength={14}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, focusedField === 'phone' && styles.focusedInput]}
            placeholder="Telefone"
            value={telefone}
            onChangeText={handlePhoneChange}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => !telefone && setFocusedField(null)}
            maxLength={15}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.input, focusedField === 'date' && styles.focusedInput]}
            placeholder="Data de nascimento"
            value={dataNascimento}
            onChangeText={handleDateChange}
            onFocus={() => setFocusedField('date')}
            onBlur={() => !dataNascimento && setFocusedField(null)}
            maxLength={10}
            keyboardType="numeric"
          />

          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
            style={[styles.input, focusedField === 'tipo' && styles.focusedInput]}
          >
            <Picker.Item label="Aluno" value="aluno" />
            <Picker.Item label="Professor" value="professor" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.spaceBelow}></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  focusedInput: {
    borderColor: '#3498db',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 5,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  spaceBelow: {
    height: 70,
  },
});

export default UserPage;
