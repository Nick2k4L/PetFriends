import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { fetchNotifications } from '../../utilities/firebaseAuth'; // Utility function for fetching notifications

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  seen: boolean;
}

export default function MessagesScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = getAuth().currentUser?.uid;

  useEffect(() => {
    if (userId) {
      const loadNotifications = async () => {
        try {
          const fetchedNotifications = await fetchNotifications(userId);
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      };

      loadNotifications();
    }
  }, [userId]);

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleString()}
      </Text>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noNotificationsText}>No matches yet!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingBottom: 16,
  },
  notificationItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  noNotificationsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 32,
  },
});
