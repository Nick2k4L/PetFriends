import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import { getAuth } from 'firebase/auth';
import { fetchParkVisits, addParkVisit, joinPlaydate } from '../../utilities/firebaseAuth';

interface ParkVisit {
  id: string;        // Firestore document ID
  latitude: number;  // Latitude
  longitude: number; // Longitude
  duration: number;  // Duration in minutes
  user: string;      // User ID
  timestamp: Date;   // Timestamp of the visit
  participants?: string[]; // Optional: Array of user IDs who joined the playdate
}

export default function MapScreen() {
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [usersAtParks, setUsersAtParks] = useState<ParkVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getAuth().currentUser?.uid;

  useEffect(() => {
    const loadParkVisits = async () => {
      try {
        const visits = await fetchParkVisits();
        setUsersAtParks(visits);
      } catch (error) {
        console.error('Error fetching park visits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParkVisits();
  }, []);

  const handleMapPress = event => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    Alert.prompt(
      'Park Visit',
      'How long will you be at this park? (in minutes)',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async duration => {
            if (userId) {
              const newVisit: Omit<ParkVisit, 'id'> = {
                latitude,
                longitude,
                duration: parseInt(duration, 10),
                user: userId,
                timestamp: new Date(),
              };

              try {
                await addParkVisit(newVisit);
                const updatedVisits = await fetchParkVisits(); // Refresh the park data
                setUsersAtParks(updatedVisits);
              } catch (error) {
                console.error('Error adding park visit:', error);
              }
            } else {
              Alert.alert('Error', 'You must be logged in to add a park visit.');
            }
          },
        },
      ],
      'plain-text',
      '30' // Default value
    );
  };

  const handleJoinPlaydate = async (playdateId: string) => {
    try {
      await joinPlaydate(playdateId, userId!); // Ensure userId is non-null
    } catch (error) {
      console.error(`Error joining playdate with ID ${playdateId}:`, error);
      Alert.alert('Error', 'Could not join the playdate.');
    }
  };
  
    

  const renderMarkers = () =>
    usersAtParks.map(visit => (
      <Marker
        key={visit.id}
        coordinate={{ latitude: visit.latitude, longitude: visit.longitude }}
        title={`User: ${visit.user}`}
        description={`Duration: ${visit.duration} mins`}
        onPress={() =>
          Alert.alert(
            'Join Playdate',
            'Would you like to join this playdate?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Joi',
                onPress: () => handleJoinPlaydate(visit.id),
              },
            ]
          )
        }
      />
    ));

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 55.751244,
            longitude: 37.618423,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
          onPress={handleMapPress} // Handle map press for adding a visit
        >
          {routeCoordinates.length > 0 && <Polyline coordinates={routeCoordinates} />}
          {renderMarkers()}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    paddingBottom: 81,
  },
});
