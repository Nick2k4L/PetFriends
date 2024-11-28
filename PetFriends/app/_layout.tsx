import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './auth/LoginScreen';
import TabLayout from './(tabs)/_layout';
import PetManagementScreen from './PetManagementScreen';

const Stack = createStackNavigator();

export default function Layout() {
  return (
    <Stack.Navigator initialRouteName="(tabs)" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="(tabs)" component={TabLayout} />
      <Stack.Screen name="PetManagement" component={PetManagementScreen} />
    </Stack.Navigator>
  );
}
