import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { createStackNavigator } from '@react-navigation/stack';
import Swiper from './Swiper';;
const Stack = createStackNavigator();

export default function TabLayout() {

  return (

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

            <Fontisto name="paw" size={32} color={color} />
            
          ),
        }}
      />
      <Tabs.Screen
        name="MapScreen"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="map-location-dot" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-draw" size={32} color={color} />
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
  );
}
