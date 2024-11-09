import Home from './src/components/Home';
import "./src/global.css";
import Footer from "./src/components/Footer";
import Header from "./src/components/Header";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
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
              />
            ),
            footer: () => <Footer navigation={navigation} />,
          })}
        />
          
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*
<View>
<Home/>
<Footer/>
</View>
*/


/*
<NavigationContainer>
        <StackNavigation.Navigator initialRouteName="Home">
          <StackNavigation.Screen
            name="Home"
            component={Home}
            options={({ navigation }) => ({
              header: () => <Header title="Home" onMenuPress={() => {}} />,
            })}
          />
        </StackNavigation.Navigator>
      </NavigationContainer>*/