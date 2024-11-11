import React from 'react';
import { View, TouchableOpacity, Linking, Alert, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const navigation = useNavigation();
  const { status, initializing } = useAuth();

  // Exibe o indicador de carregamento da Inicialiazação
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const handleNavigateToHome = async () => {
    try {
      navigation.navigate('HomePage');
    } catch (error) {
      console.error("Erro ao navegar:", error);
      Alert.alert('Erro de navegação', 'Não foi possível navegar para a página inicial.');
    }
  };

  // Função para verificar erros de abertura de links
  const handleLinking = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', `Não é possível abrir o link: ${url}`);
      }
    } catch (error) {
      console.error("Erro ao tentar abrir o link:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o link.");
    }
  };

  // Função para navegar para a página AdminPage
  const handleNavigateToAdminPage = () => {
    if (status === 'authenticated') {
      navigation.navigate('AdminPage');
    }
  };

  // Função para navegar para a página de criação de conteúdo
  const handlePlusClick = () => {
    if (status === 'authenticated') {
      console.log('Adicionar novo conteúdo');
    }
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleNavigateToHome}>
          <Icon name="home" size={25} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLinking('https://github.com/IgorFollador/educablog-web')}>
          <Icon name="github" size={25} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLinking('mailto:fiap_grupo26@outlook.com')}>
          <Icon name="envelope" size={25} color="#FFF" />
        </TouchableOpacity>

        {/* Botão Plus, visível somente se o usuário estiver logado */}
        {status === 'authenticated' && (
          <TouchableOpacity onPress={handlePlusClick}>
            <Icon name="plus" size={25} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* Botão Edit, visível somente se o usuário estiver logado */}
        {status === 'authenticated' && (
          <TouchableOpacity onPress={handleNavigateToAdminPage}>
            <Icon name="pencil" size={25} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#003366',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  iconText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003366',
  },
});

export default Footer;

