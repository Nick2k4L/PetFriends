import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './auth/LoginScreen';
import TabLayout from './(tabs)/_layout';

const Stack = createStackNavigator();

export default function Layout() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="(tabs)" component={TabLayout} />
    </Stack.Navigator>
  );
}
