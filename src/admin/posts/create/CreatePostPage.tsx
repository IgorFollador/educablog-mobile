import React, { useEffect, useState } from 'react';
import { Button, Image, Text, TextInput, View, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';  // Importação correta

// Defina seu esquema de validação usando Zod
const postSchema = z.object({
  titulo: z.string().min(3, 'O título é obrigatório e deve conter no mínimo 3 caracteres'),
  descricao: z.string().min(1, 'A descrição é obrigatória'),
  imagemUrl: z.string().url('URL de imagem inválida').optional(),
  ativo: z.boolean(),
  categoria: z.object({
    id: z.string().optional().nullable(),
    nome: z.string().optional(),
  }),
});

const CreatePostPage = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Verifica o token e redireciona se não autenticado
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('SignInPage');
      }
    };
    checkAuth();
  }, [navigation]);

  // Carrega categorias
  useEffect(() => {
    const fetchCategories = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.PUBLIC_API_URL}/categoria?limite=10&pagina=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.map((cat: any) => ({ id: cat.id, name: cat.nome })));
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias.');
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (itemValue: string) => {
    setSelectedCategoryId(itemValue);
    const selectedCategory = categories.find((category) => category.id === itemValue);
    setCategoryName(selectedCategory ? selectedCategory.name : '');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const postData: any = {
      titulo: title,
      descricao: description,
      imagemUrl: imageUrl,
      ativo: isActive,
      categoria: { id: selectedCategoryId, nome: categoryName.trim() },
    };

    // Validação com Zod
    const validation = postSchema.safeParse(postData);

    if (!validation.success) {
      setError(validation.error.issues.map((issue) => issue.message).join(', '));
      setLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Você precisa estar autenticado para criar uma postagem.');
        setLoading(false);
        return;
      }
      
      await axios.post(`${process.env.PUBLIC_API_URL}/posts`, validation.data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigation.navigate('AdminPage');
    } catch (err) {
      console.error('Erro ao criar postagem:', err);
      setError('Erro ao criar postagem. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Criar Nova Postagem</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[styles.input, focusedField === 'titulo' && styles.focusedInput]}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
          onFocus={() => setFocusedField('titulo')}
          onBlur={() => !title && setFocusedField(null)}
        />

        <TextInput
          style={[styles.input, focusedField === 'descricao' && styles.focusedInput]}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
          onFocus={() => setFocusedField('descricao')}
          onBlur={() => !description && setFocusedField(null)}
        />

        <TextInput
          style={[styles.input, focusedField === 'imagemUrl' && styles.focusedInput]}
          placeholder="URL da Imagem (opcional)"
          value={imageUrl}
          onChangeText={setImageUrl}
          onFocus={() => setFocusedField('imagemUrl')}
          onBlur={() => !imageUrl && setFocusedField(null)}
        />
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.imagePreview} /> : null}

        {/* Seletor de categoria */}
        <View style={[styles.pickerContainer, focusedField === 'categoria' && styles.focusedInput]}>
          <Picker
            selectedValue={selectedCategoryId}
            onValueChange={handleCategoryChange}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity onPress={() => setIsActive(!isActive)} style={styles.toggleContainer}>
          <View style={[styles.toggle, { backgroundColor: isActive ? '#34D399' : '#E5E7EB' }]}>
            <View style={styles.toggleButton} />
          </View>
          <Text style={styles.toggleText}>{isActive ? 'Ativo' : 'Inativo'}</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar Alterações</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.navigate('AdminPage')}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  focusedInput: {
    borderColor: '#007bff',
    borderWidth: 1.5,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggle: {
    width: 50,
    height: 25,
    borderRadius: 15,
    marginRight: 10,
    padding: 3,
    justifyContent: 'center',
  },
  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  toggleText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  submitButton: {
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50, 
    fontSize: 16,
  },
});

export default CreatePostPage;
