import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from './Home';

export default function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <View className="bg-sky-950 py-4">
      <View className="flex flex-row justify-between items-center px-5">
        
        {/* Logo e Título à esquerda */}
        <TouchableOpacity className='flex flex-row items-center' onPress={() => {Home} }>
          <Image
            source={require('../../assets/images/logo.png')} 
            style={{ width: 25, height: 25, marginRight: 8 }}
            resizeMode="contain"
          />
          <Text className="text-white text-xl">EducaBlog</Text>
        </TouchableOpacity>

        {/* Ícones de redes sociais */}
        <View className="flex flex-row items-center space-x-4">
          <TouchableOpacity className="mr-4 hover:text-yellow-500" onPress={() => Linking.openURL('https://github.com/IgorFollador/educablog-web')}>
            <Icon name="github" size={25} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity className="mr-4 hover:text-yellow-500" onPress={() => Linking.openURL('mailto:fiap_grupo26@outlook.com')}>
            <Icon name="envelope" size={25} color="#FFF" />
          </TouchableOpacity>
        </View>

      </View>

      <Text className="text-center text-white mt-4">
        &copy; {currentYear} EducaBlog. Todos os direitos reservados.
      </Text>
    </View>
  );
};
