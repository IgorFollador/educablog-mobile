import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface NavBarProps {
  isLoggedIn?: boolean;
  canGoBack?: boolean;
}

export default function Navbar({ isLoggedIn, canGoBack }: NavBarProps) {
  const navigation = useNavigation();

  const handleLogin = () => {
    Alert.alert('Login', 'Iniciar sessão.');
    // Adicione a lógica de autenticação aqui
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Sessão encerrada.');
    // Adicione a lógica para sair aqui
  };

  const handleRedirect = () => {
    if (isLoggedIn) {
      // Substitua pelo nome correto da tela Admin
    } else {
      navigation.navigate('Home'); // Substitua pelo nome correto da tela inicial
    }
  };

  return (
    <View className="bg-blue-950 pt-4 left-0 w-full shadow-md z-50">
      <View className="flex flex-row justify-between items-center p-5">
        
         {/* Voltar */}
        {canGoBack ? (
          <View onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="white" />
          </View>
        ) : (
          <View style={{ width: 28 }} />
        )}

        {/* Logo */}
        <TouchableOpacity className="flex-1 items-center" onPress={handleRedirect}>
          <View className="flex flex-row items-center">
            <Image
              source={require('../../assets/images/logo.png')}  // Substitua pelo caminho correto do logo
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <Text className="text-white text-2xl">EducaBlog</Text>
          </View>
        </TouchableOpacity>

        {/* Botão Login/Logout */}
        {isLoggedIn ? (
          <TouchableOpacity onPress={handleLogout} className="p-2">
            <Icon name="sign-out" size={25} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleLogin} className="p-2">
            <Icon name="user-circle" size={25} color="#FFF" />
          </TouchableOpacity>
        )}
        
      </View>
    </View>
  );
}
