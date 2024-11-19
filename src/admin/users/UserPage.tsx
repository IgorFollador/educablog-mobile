import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { z } from 'zod';

const UserPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [cpf, setCPF] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const userSchema = z.object({
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    name: z.string().min(1, 'Nome é obrigatório'),
    cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
    phone: z.string().min(10, 'Telefone inválido'),
    date: z.string().nonempty('Data de nascimento é obrigatória')
  });

  const formatCPF = (cpf: string) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (phone: string) => {
    return phone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatDate = (date: string) => {
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
  const handlePhoneChange = (value: string) => setPhone(formatPhone(value));
  const handleDateChange = (value: string) => setDate(formatDate(value));

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

    const formattedDate = formatDateToAPI(date);

    const userData = {
      email,
      password,
      name,
      cpf: cleanCPF(cpf),
      phone: cleanPhone(phone),
      date: formattedDate,
    };

    const validation = userSchema.safeParse(userData);

    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message).join(', ');
      setError(errors);
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${process.env.PUBLIC_API_URL}/usuario`,
        {
          email: email,
          login: email,
          senha: password,
          pessoa: {
            cpf: cleanCPF(cpf),
            nome: name,
            email: email,
            dataNascimento: formattedDate,
            telefone: cleanPhone(phone),
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setLoading(false);

      if (result.status === 201) {
        Alert.alert('Sucesso', 'Usuário criado com sucesso!');
        // Limpar os campos
        setEmail('');
        setPassword('');
        setName('');
        setCPF('');
        setPhone('');
        setDate('');
      }
    } catch (err) {
      setLoading(false);

      if (axios.isAxiosError(err)) {
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
              setError('Erro desconhecido. Por favor, tente novamente.');
          }
        } else if (err.request) {
          setError('Erro na conexão. Verifique sua internet e tente novamente.');
        } else {
          setError(`Erro desconhecido: ${err.message}`);
        }
      } else {
        setError('Erro desconhecido. Por favor, tente novamente.');
      }
    }
  };

  const handleCancel = () => {
    navigation.navigate('PostManagementPage');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Cadastro</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[styles.input, focusedField === 'email' && styles.focusedInput]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedField('email')}
          onBlur={() => !email && setFocusedField(null)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, focusedField === 'name' && styles.focusedInput]}
          placeholder="Nome Completo"
          value={name}
          onChangeText={setName}
          onFocus={() => setFocusedField('name')}
          onBlur={() => !name && setFocusedField(null)}
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
          value={phone}
          onChangeText={handlePhoneChange}
          onFocus={() => setFocusedField('phone')}
          onBlur={() => !phone && setFocusedField(null)}
          maxLength={15}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.input, focusedField === 'date' && styles.focusedInput]}
          placeholder="Data de Nascimento"
          value={date}
          onChangeText={handleDateChange}
          onFocus={() => setFocusedField('date')}
          onBlur={() => !date && setFocusedField(null)}
          maxLength={10}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, focusedField === 'password' && styles.focusedInput]}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedField('password')}
          onBlur={() => !password && setFocusedField(null)}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.spaceBelow}></View>
    </View>
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
