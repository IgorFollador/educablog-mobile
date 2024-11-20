import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  showLoginButton: boolean; // Controla se o botão de login será exibido
}

const Navbar = ({ showLoginButton }: NavbarProps) => {
  const { status, logout } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute(); // Obtém o nome da tela atual

  const handleLogin = () => {
    navigation.navigate('SignInPage');
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigation.navigate('HomePage');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const isHome = route.name === 'HomePage';
  const isPostPage = route.name === 'PostPage';
  const isUserPage = route.name === 'UserPage'; 
  const isViewPostPage = route.name === 'ViewPostPage'; 
  const isAuthenticated = status === 'authenticated'; // Verifica se o usuário está autenticado

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbarContent}>
        {/* Exibe o botão voltar */}
        {(isUserPage ||isPostPage || isViewPostPage || (navigation.canGoBack() && !isHome && !isAuthenticated)) && (
          <TouchableOpacity onPress={handleGoBack}>
            <Icon name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
        )}

        <View style={styles.logoContainer}>
          <View style={styles.logoContent}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} />
            <Text style={styles.logoText}>EducaBlog</Text>
          </View>
        </View>

        {showLoginButton && !isAuthenticated && (
          <TouchableOpacity onPress={handleLogin} style={styles.iconButton}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Icon name="user-circle" size={25} color="#FFF" />
            )}
          </TouchableOpacity>
        )}
        {isAuthenticated && (
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Icon name="sign-out" size={25} color="#FFF" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: '#003366',
    paddingTop: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    zIndex: 50,
  },
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  iconButton: {
    padding: 8,
  },
});

export default Navbar;
