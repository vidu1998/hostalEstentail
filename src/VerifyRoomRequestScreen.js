import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firebase } from '../config';

const VerifyRoomRequestScreen = () => {
  const [roomRequests, setRoomRequests] = useState([]);

  useEffect(() => {
    fetchRoomRequests();
  }, []);

  const fetchRoomRequests = async () => {
    try {
      const roomRequestsRef = firebase.firestore().collection('room_requests');
      const snapshot = await roomRequestsRef.where('verified', '==', false).get();
      const fetchedRoomRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRoomRequests(fetchedRoomRequests);
    } catch (error) {
      console.error('Error fetching room requests:', error);
    }
  };

  const verifyRoomRequest = async (id, roomId) => {
    try {
      // Update the 'verified' field to true in Firestore for the room request
      await firebase.firestore().collection('room_requests').doc(id).update({
        verified: true
      });
  
      // Fetch room details
      const roomRef = firebase.firestore().collection('rooms').doc(roomId);
      const roomSnapshot = await roomRef.get();
      const roomData = roomSnapshot.data();
  
      // Update room details
      await roomRef.update({
        taken: roomData.taken + 1, // Increment taken by one
        availability: roomData.availability - 1 // Decrement availability by one
      });
  
      // Show success message
      Alert.alert('Success', 'Room request verified successfully.');
  
      // Fetch updated room requests
      fetchRoomRequests();
    } catch (error) {
      // Show error message
      Alert.alert('Error', 'Failed to verify room request: ' + error.message);
    }
  };

  const renderRoomRequestItem = ({ item }) => (
    <View style={styles.roomRequestItem}>
    <View style={styles.textContainer}>
      <Text style={styles.text}>Room Name: {item.roomName}</Text>
      <Text style={styles.text}>User ID: {item.userId}</Text>
    </View>
    <TouchableOpacity style={styles.verifyButton} onPress={() => verifyRoomRequest(item.id, item.roomId)}>
      <Text style={styles.verifyText}>Verify</Text>
    </TouchableOpacity>
  </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify Room Requests</Text>
      <FlatList
        data={roomRequests}
        renderItem={renderRoomRequestItem}
        keyExtractor={item => item.id}
        style={styles.roomRequestList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
   roomRequestItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    marginBottom: 5,
  },
  verifyButton: {
    backgroundColor: '#026efd',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  verifyText: {
    color: 'white',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  roomRequestList: {
    width: '100%',
  },
  roomRequestItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#026efd',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default VerifyRoomRequestScreen;