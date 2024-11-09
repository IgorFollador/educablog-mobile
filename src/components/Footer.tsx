import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
  return (
    <View className="bg-sky-950 py-4 flex-row justify-center items-center px-5 fixed bottom-0 left-0 right-0">
      {/* Ícones centralizados com menor espaçamento entre eles */}
      <View className="flex-row items-center justify-between w-full px-10">
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/IgorFollador/educablog-web')}>
          <Icon name="github" size={25} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:fiap_grupo26@outlook.com')}>
          <Icon name="envelope" size={25} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:fiap_grupo26@outlook.com')}>
          <Icon name="plus" size={25} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
