import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Navbar ({ isLoggedIn }) {

  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    Alert.alert('Login', 'Iniciar sessão.');
    // Função de login - adicione lógica para autenticação aqui
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Sessão encerrada.');
    // Função de logout - adicione lógica para sair aqui
  };

  const handleRedirect = () => {
    if (isLoggedIn) {
      // Substitua pelo nome correto da tela Admin
    } else {
      navigation.navigate('Home');  // Substitua pelo nome correto da tela inicial
    }
  };

  return (
    <View className="bg-blue-950 pt-4 left-0 w-full shadow-md z-50">
      <View className="flex flex-row justify-between items-center p-5">

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

        {/* Botão de menu sanduíche */}
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)} className="p-2">
          <Icon
            name={isOpen ? 'close' : 'menu'}
            size={30}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      {/* Menu de login/logout visível ao abrir o menu sanduíche */}
      {isOpen && (
        <View style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          backgroundColor: '#0a3a67', // Defina o mesmo tom de azul
          zIndex: 50,
          alignItems: 'center',
          paddingVertical: 10
        }}>
          {isLoggedIn ? (
            <TouchableOpacity onPress={handleLogout} style={{ paddingVertical: 10, width: '100%', alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontSize: 18 }}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleLogin} style={{ paddingVertical: 10, width: '100%', alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontSize: 18 }}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
