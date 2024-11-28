import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import { getAppleMapKitDirections, MapKitTransit } from 'react-native-apple-mapkit-directions';

export default function App() {
  const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  const origin = {
    latitude: 55.751244,
    longitude: 37.618423,
  };
  const destination = {
    latitude: 59.9375,
    longitude: 30.308611,
  };
  const transitType = MapKitTransit.AUTOMOBILE;
  const [routeCoordinates, setRouteCoordinates] = React.useState<LatLng[]>([]);
  const [petStores, setPetStores] = React.useState([
    { latitude: 46.7243579, longitude: -116.9968032, name: 'Pets Are People Too' },
    { latitude: 46.7331588, longitude: -117.0327213, name: 'Petco' },
    { latitude: 47.608551, longitude: -117.368202, name: 'Petsmart' },
  ]);

  React.useEffect(() => {
    const getPoints = async () => {
      if (Platform.OS === 'ios') {
        try {
          const points = await getAppleMapKitDirections(origin, destination, transitType);
          setRouteCoordinates(points.coordinates);
        } catch (error) {
          console.log('Error fetching route:', error);
        }
      }
    };
    getPoints();
  }, []);

  return (
    <MapView style={styles.map} initialRegion={{
      latitude: (origin.latitude + destination.latitude) / 2,
      longitude: (origin.longitude + destination.longitude) / 2,
      latitudeDelta: 5,
      longitudeDelta: 5,
    }}>
      {routeCoordinates.length > 0 && <Polyline coordinates={routeCoordinates} />}
      {petStores.map((store, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: store.latitude, longitude: store.longitude }}
          title={store.name}
        />
      ))}
    </MapView>
  );
}
