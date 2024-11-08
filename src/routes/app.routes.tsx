import Main from "@/src/screens/Main";
import { createNativeStackNavigator} from "@react-navigation/native-stack"
import PostDetails from "@/src/screens/PostDetails";
import LoginAluno from "../screens/LoginAluno";
import Home from "../screens/Home";


const { Navigator, Screen} = createNativeStackNavigator()

export function AppRoutes(){
  return(
  <Navigator screenOptions={{headerShown: false}}>
    <Screen
      name="Home"
      component={Home}
    />

    {/* <Screen
      name="Main"
      component={Main}
    />

    <Screen
      name="LoginAluno"
      component={LoginAluno}
    />

    <Screen
      name="PostDetails"
      component={PostDetails}
    /> */}
  </Navigator>
  )

}