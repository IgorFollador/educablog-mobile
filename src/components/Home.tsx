import { useState } from 'react';
import { View,Text} from 'react-native';
import SearchBar from './SearchBar';

export default function Home() {

    const [lastUpdate, setLastUpdate] = useState<string>('--/--/---- --:--:--');

    return (
        <View className="w-full mx-auto m-3 p-4 pt-16">
            <Text className="text-3xl font-bold text-black text-center m-2">Postagens</Text>
            <Text className="text-gray-500">Última atualização {lastUpdate}</Text>
            <SearchBar/>
        </View>
    );

};
