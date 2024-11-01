import AppRoutes from "@/routes/app.routes";
import { NavigationContainer } from "@react-navigation/native";

export function Routes() {
    return(
        <NavigationContainer>
            <AppRoutes />
        </NavigationContainer>
    )
}