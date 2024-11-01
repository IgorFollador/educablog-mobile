import Home from '@/screens/Home';
import Login from '@/screens/Login';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';

const { Navigator, Screen } = createNativeStackNavigator();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false
}

export default function AppRoutes() {
  return (
    <Navigator screenOptions={screenOptions}>
      <Screen name="home" component={Home} />
      <Screen name="login" component={Login} />
    </Navigator>
  );
}
