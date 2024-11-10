import Home from './src/components/Home';
import "./src/global.css";
import Footer from "./src/components/Footer";
import Header from "./src/components/Header";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <View className="flex-1">
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={({ navigation }) => ({
              header: () => (
                <Header
                  title="Home"
                  onMenuPress={() => {}}
                  canGoBack={navigation.canGoBack()}
                />
              ),
            })}
          />
        </Stack.Navigator>
        <Footer/>
      </NavigationContainer>
    </View>
  );
}

/*
<View>
<Home/>
<Footer/>
</View>
*/

/*
<View className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Home />
      </ScrollView>

      <Footer />
    </View>
*/

/*
return (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={Home}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Home"
            onMenuPress={() => {}}
            canGoBack={navigation.canGoBack()}
          />
        ),
        footer: () => <Footer navigation={navigation} />,
      })}
    />
    </Stack.Navigator>
  </NavigationContainer>
);*/