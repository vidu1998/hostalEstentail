import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { firebase } from '../config';

const MyRoomScreen = () => {
  const [userId, setUserId] = useState('');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid); 
        console.log(user.uid);
        // Set the current user's ID
      } else {
        // User is not logged in, handle this case if necessary
      }
    });

    return () => {
      unsubscribe(); // Cleanup function
    };
  }, []);

  useEffect(() => {
    fetchUserRooms();
  }, [userId]);

  const fetchUserRooms = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userRoomsRef = firebase.firestore().collection('room_requests').where('userId', '==', user.uid).where('verified', '==', true);
        const snapshot = await userRoomsRef.get();
        const fetchedRooms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRooms(fetchedRooms);
      }
    } catch (error) {
      console.error('Error fetching user rooms:', error);
    }
  };

  return (
<View style={styles.container}>
  <Text style={styles.title}>My Rooms</Text>
  <FlatList
    data={rooms}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.roomItem}>
        <Text>Room ID: {item.roomId}</Text>
        <Text>Room Name: {item.roomName}</Text>
        <Text>User ID: {item.userId}</Text>
        <Text>Verified: {item.verified ? 'Yes' : 'No'}</Text>
        {/* Render other room details as needed */}
      </View>
    )}
  />
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  roomItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default MyRoomScreen;