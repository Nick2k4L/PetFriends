import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedText } from '../../components/ThemedText'; 
import { ThemedView } from '../../components/ThemedView'; 
import ParallaxScrollView from '@/components/ParallaxScrollView'; 
import { Tabs } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ParallaxScrollView backgroundColor="#b7d0cd">
      <ThemedView style={styles.bannerContainer} transparent>
        <Image source={require('../../assets/images/pet-banner.jpg')} style={styles.bannerImage} />
        <View style={styles.overlay}>
          <ThemedText type="title" style={styles.welcomeText} darkColor="#000000">
            Pet Friends
          </ThemedText>
        </View>
      </ThemedView>
      <ThemedView style={styles.buttonContainer} transparent>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Matching')}>
          <Ionicons name="paw" size={24} color="#fff" />
          <ThemedText style={styles.tabText}>Start Matching</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#fff" />
          <ThemedText style={styles.tabText}>View Profile</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Friends')}>
          <Ionicons name="people" size={24} color="#fff" />
          <ThemedText style={styles.tabText}>Add Friends</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="map" size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Search Nearby</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          height: 60,
          paddingBottom: 5,
          width: '122%',
          marginLeft: '-11%',
          bottom: -28,
        },
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <View style={ {paddingTop: 10, overflow: 'visible'}}>
              <Ionicons name="home" size={size} color={color}/>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="PetManagement"
        options={{
          title: 'Pets',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="DogSwiper"
        options={{
          title: 'Match',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Login"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'relative', // Enable absolute positioning within this container
    width: '100%',
  },
  bannerImage: {
    width: '122%',
    marginLeft: '-11%',
    top: -33,
    height: 200,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute', // Position the overlay absolutely over the banner image
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center',    // Center the content horizontally
    marginTop: 30,
    borderColor: 'black',
    borderRadius: 10,
    height: '30%',
  },
  welcomeText: {
    fontSize: 30,
    color: '#FFFFFF', // Ensure the text is visible over the image
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginTop: -7,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 18,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#b7d0cd',
    padding: 10,
  },
  tab: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  tabText: {
    color: '#fff',
    marginTop: 5,
  },
});
