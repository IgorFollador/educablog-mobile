import Home from './src/components/Home';
import "./src/global.css";
import Footer from "./src/components/Footer";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import Navbar from './src/components/NavBar';

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
                <Navbar
                  isLoggedIn={false}
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