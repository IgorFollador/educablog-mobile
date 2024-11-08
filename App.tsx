import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";

const StackNavigation = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Header/>
      <StackNavigation.Navigator initialRouteName="Home">
        {/* <StackNavigation.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        /> */}
        <StackNavigation.Screen
          name="Home"
          component={Home}
        />
        {/* <StackNavigation.Screen
          name="RegisterUser"
          component={RegisterUser}
          options={({ navigation }) => ({
            header: () => (
              <Header
                title="RegisterUser"
                onMenuPress={() => {}}
                canGoBack={navigation.canGoBack()}
              />
            ),
            footer: () => <Footer/>,
          })}
        /> */}
      </StackNavigation.Navigator>
      <Footer/>
    </NavigationContainer>
  );
}
