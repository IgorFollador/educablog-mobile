import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from './src/components/Home';
import "./src/global.css";

const StackNavigation = createNativeStackNavigator();

export default function App() {
  return (
    <Home/>
  );
}
