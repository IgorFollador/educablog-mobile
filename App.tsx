import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from './src/components/NavBar';
import SignInPage from './src/auth/signin/SignInPage';
import AdminPage from './src/admin/AdminPage';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomePage from './src/Home/HomePage';
import Footer from './src/components/Footer';
import CreatePostPage from './src/admin/posts/create/CreatePostPage';
import CreateUserPage from './src/admin/users/create/CreateUserPage';
import EditPostPage from './src/admin/posts/edit/EditPostPage';

const Stack = createStackNavigator();

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
        initialRouteName={status === 'authenticated' ? 'AdminPage' : 'HomePage'}
        screenOptions={({ route }) => ({
          header: () => {
            const showLoginButton = route.name !== 'SignInPage';
            return <Navbar showLoginButton={showLoginButton} />;
          },
        })}
      >
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen
          name="SignInPage"
          component={SignInPage}
          options={{ title: 'Login' }}
        />
        <Stack.Screen name="AdminPage" component={AdminPage} />
        <Stack.Screen name="CreatePostPage" component={CreatePostPage} />
        <Stack.Screen name="CreateUserPage" component={CreateUserPage} />
        <Stack.Screen name="EditPostPage" component={EditPostPage} />
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
