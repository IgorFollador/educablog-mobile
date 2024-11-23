import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Linking, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { initializing } = useAuth();
  const [showActionsDrawer, setShowActionsDrawer] = useState(false);

  const { isAdmin } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const handleNavigateToHome = () => {
    try {
      isAdmin()? navigation.navigate('PostManagementPage') : navigation.navigate('HomePage');
    } catch (error) {
      console.error("Erro ao navegar:", error);
      Alert.alert('Erro de navegação', 'Não foi possível navegar para a página inicial.');
    }
  };

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

  const handlePlusClick = () => {
    setShowActionsDrawer(isAdmin());
  };

  const handleNavigateToPostPage = () => {
    setShowActionsDrawer(false);
    navigation.navigate('PostPage'); 
  };

  const handleNavigateToUserPage = () => {
    setShowActionsDrawer(false); 
    navigation.navigate('UserPage');
  };

  const handleNavigateToUserManagementPage = () => {
    setShowActionsDrawer(false); 
    navigation.navigate('UserManagementPage');
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

        {isAdmin() &&  (
          <TouchableOpacity onPress={handlePlusClick}>
            <Icon name="pencil" size={25} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
      
      {isAdmin() &&  (
        <Modal
          visible={showActionsDrawer}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowActionsDrawer(false)}
        >
          <View style={styles.drawerContainer}>
            <View style={styles.drawerContent}>
              <TouchableOpacity onPress={handleNavigateToPostPage} style={styles.drawerItem}>
                <Icon name="file-text" style={styles.icon} />
                <Text style={styles.drawerItemText}>Adicionar Post</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNavigateToUserPage} style={styles.drawerItem}>
                <Icon name="user-plus" style={styles.icon} />
                <Text style={styles.drawerItemText}>Adicionar Usuário</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNavigateToUserManagementPage} style={styles.drawerItem}>
                <Icon name="users" style={styles.icon} />
                <Text style={styles.drawerItemText}>Gerenciar Usuários</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowActionsDrawer(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  drawerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  drawerItemText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    color: '#003366',
    fontSize: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003366',
  },
});

export default Footer;
