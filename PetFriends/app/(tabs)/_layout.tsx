import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import PetManagementScreen from './PetManagementScreen';
import Swiper from './Swiper';
import Home from './index'
const Stack = createStackNavigator();

export default function TabLayout() {
  return (
    <Stack.Navigator initialRouteName="PetManagement" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="PetManagement" component={PetManagementScreen} />
      <Stack.Screen name="DogSwiper" component={Swiper} />
    </Stack.Navigator>
  );
}
