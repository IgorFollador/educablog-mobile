import Main from "@/app/screens/Main";
import LoginAluno from "../app/screens/LoginAluno";
import { createNativeStackNavigator} from "@react-navigation/native-stack"

const { Navigator, Screen} = createNativeStackNavigator()

export function AppRoutes(){
 return(
    <Navigator screenOptions={{headerShown: false}}>
        <Screen name="Main"
        component={Main}/>
        <Screen name="LoginAluno"
        component={LoginAluno}/>
    </Navigator>
 )

}