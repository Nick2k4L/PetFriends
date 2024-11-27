import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../LoginScreen';

import HomeScreen from './index'

const Stack = createStackNavigator();

export default function TabLayout() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
