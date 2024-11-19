import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from './src/components/NavBar';
import SignInPage from './src/auth/signin/SignInPage';
import PostManagementPage from './src/admin/posts/PostManagementPage';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomePage from './src/Home/HomePage';
import Footer from './src/components/Footer';
import PostPage from './src/admin/posts/PostPage';
import UserPage from './src/admin/users/UserPage';
import { createStackNavigator } from '@react-navigation/stack';
import ViewPostPage from './src/posts/[id]/ViewPostPage';
import UserManagementPage from './src/admin/users/UserManagementPage';

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
        initialRouteName={status === 'authenticated' ? 'PostManagementPage' : 'HomePage'}
        screenOptions={({ route }) => ({
          header: () => {
            const showLoginButton = route.name !== 'SignInPage';
            return <Navbar showLoginButton={showLoginButton} />;
          },
        })}
      >
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="SignInPage" component={SignInPage}/>
        <Stack.Screen name="PostManagementPage" component={PostManagementPage} />
        <Stack.Screen name="PostPage" component={PostPage}/>
        <Stack.Screen name="UserPage" component={UserPage} />
        <Stack.Screen name="ViewPostPage" component={ViewPostPage} />
        <Stack.Screen name="UserManagementPage" component={UserManagementPage} />
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
