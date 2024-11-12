import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from './src/components/NavBar';
import SignInPage from './src/auth/signin/SignInPage';
import AdminPage from './src/admin/AdminPage';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomePage from './src/Home/HomePage';
import Footer from './src/components/Footer';
import PostPage from './src/admin/posts/PostPage';
import CreateUserPage from './src/admin/users/create/CreateUserPage';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </NavigationContainer>
  );
}

const MainContent = () => {
  const { status, initializing } = useAuth(); // Incluindo "initializing" para o estado de carregamento

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Navigator
        id={undefined}
        initialRouteName={status === 'authenticated' ? 'AdminPage' : 'HomePage'}
        screenOptions={({ route }) => ({
          header: () => {
            const showLoginButton = route.name !== 'SignInPage';
            return <Navbar showLoginButton={showLoginButton} />;
          },
        })}
      >
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="SignInPage" component={SignInPage}/>
        <Stack.Screen name="AdminPage" component={AdminPage} />
        <Stack.Screen name="PostPage" component={PostPage}/>
        <Stack.Screen name="CreateUserPage" component={CreateUserPage} />
      </Stack.Navigator>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
