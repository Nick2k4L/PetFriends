import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../LoginScreen';
import PetManagementScreen from '../PetManagementScreen';
import Siper from '../Siper';
import Home from './index'
const Stack = createStackNavigator();

export default function TabLayout() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PetManagement" component={PetManagementScreen} />
      <Stack.Screen name="DogSwiper" component={Siper} />
    </Stack.Navigator>
  );
}
