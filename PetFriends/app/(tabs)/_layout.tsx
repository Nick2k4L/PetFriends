import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import PetManagementScreen from './PetManagementScreen';
import Swiper from './Swiper';
import Home from './index'
import MapView from './MapView'
import HomeScreen from './index';
const Stack = createStackNavigator();

export default function TabLayout() {

  return (
    <SafeAreaView style={styles.container}>
      <Tabs
      // Make the tabs appear at the bottom of the screen and fill the width
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          borderWidth: 0,
          bottom: 0,
          width: '100%',
          backgroundColor: 'transparent',
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
          ...Platform.select({
            ios: {
              paddingBottom: 20 // Accounts for iOS safe area
            }
          })
        },
        tabBarIconStyle: {
          width: '100%',
          height: '100%',
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
      }}>
      <Tabs.Screen
        name="Swiper"
        options={{
          title: 'Swiper',
  
          tabBarIcon: ({ color }) => (

            <Fontisto name="paw" size={32} color={color}/>
            
          ),
        }}
      />
      <Tabs.Screen
        name="MapScreen"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="map-marker-alt" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={32} color={color}/>
          ),
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

    <Stack.Navigator initialRouteName="Login" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PetManagement" component={PetManagementScreen} />
      <Stack.Screen name="DogSwiper" component={Swiper} />
      <Stack.Screen name="Map" component={MapView} />
    </Stack.Navigator>
  );
}
