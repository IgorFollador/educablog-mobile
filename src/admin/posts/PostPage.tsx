import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, View, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

type PostPageNavigationProp = NavigationProp<RootStackParamList, 'PostPage'>;
type PostPageRouteProp = RouteProp<RootStackParamList, 'PostPage'>;

const postSchema = z.object({
  titulo: z.string().min(3, 'O título é obrigatório e deve conter no mínimo 3 caracteres'),
  descricao: z.string().min(1, 'A descrição é obrigatória'),
  imagemUrl: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(val), {
      message: 'URL de imagem inválida',
    }),
  ativo: z.boolean(),
  categoria: z.object({
    id: z.string().optional().nullable(),
    nome: z.string().optional(),
  }),
});

const PostPage = () => {
  const navigation = useNavigation<PostPageNavigationProp>();
  const { params } = useRoute<PostPageRouteProp>();
  const postId = params?.postId;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) return;
          
          const response = await axios.get(`${process.env.PUBLIC_API_URL}/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const post = response.data;
          setTitle(post.titulo);
          setDescription(post.descricao);
          setImageUrl(post.imagemUrl || '');
          setSelectedCategoryId(post.categoria?.id || null);
          setCategoryName(post.categoria?.nome || '');
          setIsActive(post.ativo);
        } catch (err) {
          console.error('Erro ao carregar a postagem:', err);
          setError('Erro ao carregar a postagem.');
        }
      };
      fetchPost();
    }
  }, [postId]);

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

    const validation = postSchema.safeParse(postData);

    if (!validation.success) {
      setError(validation.error.issues.map((issue) => issue.message).join(', '));
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

      if (postId) {
        // Editar post existente
        await axios.put(`${process.env.PUBLIC_API_URL}/posts/${postId}`, validation.data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Criar novo post
        await axios.post(`${process.env.PUBLIC_API_URL}/posts`, validation.data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigation.navigate('PostManagementPage');
    } catch (err) {
      console.error('Erro ao salvar postagem:', err);
      setError('Erro ao salvar postagem. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{postId ? 'Editar Postagem' : 'Criar Nova Postagem'}</Text>
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

        <View style={[styles.pickerContainer, focusedField === 'categoria' && styles.focusedInput]}>
          <Picker
            selectedValue={selectedCategoryId}
            onValueChange={handleCategoryChange}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma categoria" style={styles.pickerLabelItem} value="" />
            {categories.map((category) => (
              <Picker.Item style={styles.pickerItem} key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity onPress={() => setIsActive(!isActive)} style={styles.toggleContainer}>
          <View style={[styles.toggle, { backgroundColor: isActive ? '#34D399' : '#E5E7EB' }]} />
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
            onPress={() => navigation.navigate('PostManagementPage')}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.spaceBelow}></View>
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
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, 
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#28a745', 
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  spaceBelow: {
    height: 70,
  },
  pickerLabelItem: {
    color: '#898989',
  },
  pickerItem: {
    color: '#000',
  }
});

export default PostPage;
