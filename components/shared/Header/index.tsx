import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Main from '@/app/screens/Main';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, showBackButton = false}) => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      {/*
      Botão removido até definir se né necessário
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
      )}
      
      Botão de Menu removido até configurar openDrawer (se fizer sentido)
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <Ionicons name="menu" size={32} color="white" />
      </TouchableOpacity>
*/}
    
      <Image
        source={require('@/assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={handleLoginPress} style={styles.loginButton}>
         <Ionicons name='log-in-outline' size={24} color="#d2a209" />
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#182454',
    paddingHorizontal: 16,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
 
  logo: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignContent: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontWeight: '600',
    color: '#d2a209',
    marginLeft: 5,
    fontSize: 16,
  },
});

export default Header;
