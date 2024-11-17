import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView backgroundColor="#FFFFFF">
      <ThemedView style={styles.bannerContainer} transparent>
        <Image source={require('@/assets/images/pet-banner.jpg')} style={styles.bannerImage} />
        <View style={styles.overlay}>
          <ThemedText type="title" style={styles.welcomeText} darkColor="#000000">
            Pet Friends
          </ThemedText>
        </View>
      </ThemedView>
      <ThemedView style={styles.buttonContainer} transparent>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="paw" size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Start Matching</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="person" size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>View Profile</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="people" size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Add Friends</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="map" size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Search Nearby</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'relative', // Enable absolute positioning within this container
    width: '100%',
  },
  bannerImage: {
    width: '120%',
    marginLeft: '-10%',
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
});
