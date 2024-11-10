import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function Footer() {
  const navigation = useNavigation();

  const handleNavigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-sky-950 py-4 px-5 flex-row justify-center items-center">
      <View className="flex-row items-center justify-between w-full px-10">
        <TouchableOpacity onPress={handleNavigateToHome}>
          <Icon name="home" size={25} color="#FFF" />
        </TouchableOpacity>
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
