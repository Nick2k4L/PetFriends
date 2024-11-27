import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import PetManagementScreen from './PetManagementScreen';
import Swiper from './Swiper';
import HomeScreen from './index'
const Stack = createStackNavigator();

export default function TabLayout() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="PetManagement" component={PetManagementScreen} />
      <Stack.Screen name="DogSwiper" component={Swiper} />
    </Stack.Navigator>
  );
}
