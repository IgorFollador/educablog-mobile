import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';

import Login from '@/screens/Login';
import Register from '@/screens/Register';

const { Navigator, Screen } = createNativeStackNavigator();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false
}

export default function AppRoutes() {
  return (
    <Navigator screenOptions={screenOptions}>
      <Screen name="login" component={Login} />
    </Navigator>
  );
}
