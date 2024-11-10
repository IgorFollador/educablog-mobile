import { useState } from 'react';
import { View,Text, ScrollView} from 'react-native';
import SearchBar from './SearchBar';
import PostList from './PostList';

export default function Home() {

    const [lastUpdate, setLastUpdate] = useState<string>('--/--/---- --:--:--');

    return (
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}keyboardShouldPersistTaps="handled">
            <View className="w-full mx-auto p-4">
                <Text className="text-2xl font-bold text-black text-center m-2">Postagens</Text>
                <Text className="text-gray-500">Última atualização {lastUpdate}</Text>
                <SearchBar/>
                <PostList/>
            </View>
        </ScrollView>
    );

};
 