import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { z } from 'zod';

// Esquema de validação com zod
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

const EditPostPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.PUBLIC_API_URL}/categoria?limite=10&pagina=1`);
        const categoryData = response.data.map((cat: any) => ({
          id: cat.id,
          name: cat.nome,
        }));
        setCategories(categoryData);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchPostData = async () => {
        try {
          const response = await axios.get(`${process.env.PUBLIC_API_URL}/posts/${id}`);
          const post = response.data;
          setTitle(post.titulo);
          setDescription(post.descricao);
          setImageUrl(post.imagemUrl);
          setIsActive(post.ativo);
          if (post.categoria) {
            setSelectedCategoryId(post.categoria.id);
            setCategoryName(post.categoria.nome.toUpperCase());
          }
          if (post.usuarioCriacao?.pessoa?.nome) {
            setAuthorName(post.usuarioCriacao.pessoa.nome);
          }
        } catch (err) {
          console.error('Erro ao carregar dados da postagem:', err);
          setError('Erro ao carregar dados da postagem.');
        }
      };

      fetchPostData();
    }
  }, [id]);

  const handleCategoryChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setCategoryName(upperValue);
    const selectedCategory = categories.find((category) => category.name === upperValue);
    setSelectedCategoryId(selectedCategory ? selectedCategory.id : null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const postData = {
      titulo: title,
      descricao: description,
      imagemUrl: imageUrl,
      ativo: isActive,
      categoria: categoryName
        ? {
            id: selectedCategoryId,
            nome: categoryName.trim(),
          }
        : undefined,
    };

    const validation = postSchema.safeParse(postData);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message).join(', ');
      setError(errors);
      setLoading(false);
      return;
    }

    try {
      await axios.put(`${process.env.PUBLIC_API_URL}/posts/${id}`, validation.data);
      navigation.navigate('AdminPage');
    } catch (err) {
      console.error('Erro ao editar postagem:', err);
      setError('Erro ao editar postagem. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Editar Postagem</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="URL da Imagem (opcional)"
          value={imageUrl}
          onChangeText={setImageUrl}
        />
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.imagePreview} /> : null}

        <TextInput
          style={styles.input}
          placeholder="Nome da Categoria"
          value={categoryName}
          onChangeText={handleCategoryChange}
        />

        <TouchableOpacity onPress={() => setIsActive(!isActive)} style={styles.toggleContainer}>
          <View style={[styles.toggle, { backgroundColor: isActive ? '#34D399' : '#E5E7EB' }]}>
            <View style={styles.toggleButton} />
          </View>
          <Text style={styles.toggleText}>{isActive ? 'Ativo' : 'Inativo'}</Text>
        </TouchableOpacity>

        {authorName && (
          <View style={styles.authorContainer}>
            <Text>Autor</Text>
            <Text style={styles.authorText}>{authorName}</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar Alterações</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.navigate('AdminPage')}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
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
  textArea: {
    height: 100,
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
  authorContainer: {
    marginBottom: 10,
  },
  authorText: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
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
  },
});

export default EditPostPage;
