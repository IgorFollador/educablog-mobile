import { useState } from 'react';
import { View, Button, Text, Alert, TextInput} from 'react-native';

export default function Home() {

    const [lastUpdate, setLastUpdate] = useState<string>('--/--/---- --:--:--');

    return (
        <View className="max-w-3xl mx-auto m-10 p-4 pt-16">
            <Text className="text-3xl font-bold text-black">Postagens</Text>
            <Text className="text-red-600">Última atualização {lastUpdate}</Text>
            <Button title='Buscar' />
        </View>
    );

};
