import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Tabs } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();

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
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (

            <Fontisto name="paw" size={32} color={color}/>
            
          ),
        }}
      />
      <Tabs.Screen
        name="PetManagement"
        options={{
          title: 'Pets',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="DogSwiper"
        options={{
          title: 'Match',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Login"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={32}/>
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