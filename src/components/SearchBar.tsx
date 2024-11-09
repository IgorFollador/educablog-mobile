import React from 'react';
import { View, TextInput, Text, TouchableOpacity} from 'react-native';

export default function SearchBar() {

  return (
    <View className="mb-6">
      <TextInput
        value=""
        onChangeText= {() =>{}}
        placeholder="Buscar posts..."
        className="border p-2 w-full rounded mb-2"
      />
      <TouchableOpacity
        onPress= {() =>{}}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors w-full"
      >
        <Text className='text-center text-white'>Buscar</Text>
      </TouchableOpacity>
    </View>
  );

};
