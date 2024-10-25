import Main from "@/app/screens/Main";
import LoginAluno from "../app/screens/LoginAluno";
import { createNativeStackNavigator} from "@react-navigation/native-stack"
import Home from "@/app/screens/Home";
import PostDetails from "@/app/screens/PostDetails";


const { Navigator, Screen} = createNativeStackNavigator()

export function AppRoutes(){
 return(
    <Navigator screenOptions={{headerShown: false}}>
        <Screen name="Home"
        component={Home}/>
        
        <Screen name="Main"
        component={Main}/>

        <Screen name="LoginAluno"
        component={LoginAluno}/>

        <Screen name="PostDetails"
        component={PostDetails} />
    </Navigator>
 )

}