import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';

const posts = [
  {
    id: '1',
    title: 'Como usar NativeWind no React Native',
    author: 'João Silva',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Aprenda a usar NativeWind para estilizar seu aplicativo.',
  },
  {
    id: '2',
    title: 'React Native e Expo: Guia Completo',
    author: 'Maria Santos',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Uma introdução ao desenvolvimento mobile com Expo.',
  },
  {
    id: '3',
    title: 'Styled Components vs NativeWind',
    author: 'Carlos Oliveira',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Comparação entre Styled Components e NativeWind no React Native.',
  },
  {
    id: '4',
    title: 'Styled Components vs NativeWind',
    author: 'Carlos Oliveira',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Comparação entre Styled Components e NativeWind no React Native.',
  },
  {
    id: '5',
    title: 'Styled Components vs NativeWind',
    author: 'Carlos Oliveira',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Comparação entre Styled Components e NativeWind no React Native.',
  },
  {
    id: '6',
    title: 'Styled Components vs NativeWind',
    author: 'Carlos Oliveira',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Comparação entre Styled Components e NativeWind no React Native.',
  },
];

export default function Home() {
  const renderPost = ({ item }) => (
    <View className="bg-white m-4 p-4 rounded-lg shadow-lg">
      <Image source={{ uri: item.imageUrl }} className="w-full h-40 rounded-md mb-4" />
      <Text className="text-xl font-semibold text-gray-900 mb-2">{item.title}</Text>
      <Text className="text-gray-500 mb-1">Por {item.author}</Text>
      <Text className="text-gray-700">{item.description}</Text>
    </View>
  );

  return (
    <View className='justify-center'>
      <View>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}
