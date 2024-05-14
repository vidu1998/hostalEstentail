import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { firebase } from '../config';

const RoomRequestScreen = () => {
  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid); // Set the current user's ID
      } else {
        // User is not logged in, handle this case if necessary
      }
    });

    return () => {
      unsubscribe(); // Cleanup function
    };
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsRef = firebase.firestore().collection('rooms');
      const snapshot = await roomsRef.get();
      const fetchedRooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(fetchedRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const requestRoom = async () => {
    try {
      // Check if user already has a verified room request
      const existingRequestSnapshot = await firebase.firestore()
        .collection('room_requests')
        .where('userId', '==', userId)
        .where('verified', '==', true)
        .get();
  
      if (!existingRequestSnapshot.empty) {
        // User already has a verified request
        Alert.alert('Error', 'You already have a verified room request.');
        return;
      }
  
      // Construct room request object
      const roomRequest = {
        userId: userId,
        roomId: roomId,
        roomName: roomName,
        verified: false // Initially false, you can update it later when verified
      };
  
      // Add room request to Firestore
      await firebase.firestore().collection('room_requests').add(roomRequest);
  
      // Show success message
      Alert.alert('Success', 'Room request sent successfully.');
    } catch (error) {
      // Show error message
      Alert.alert('Error', 'Failed to send room request: ' + error.message);
    }
  };
  const renderRoomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => {
       
        setRoomId(item.id);
        setRoomName(item.name);
      }}
    >
      <Text>Room Name: {item.name}</Text>
      <Text>Capacity: {item.capacity}</Text>
      <Text>Taken: {item.taken}</Text>
      <Text>Availability: {item.availability}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Room Request</Text>
      <FlatList
        data={rooms}
        renderItem={renderRoomItem}
        keyExtractor={item => item.id}
        style={styles.roomList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Selected Room ID"
          value={roomId}
          onChangeText={text => setRoomId(text)}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Selected Room Name"
          value={roomName}
          onChangeText={text => setRoomName(text)}
          editable={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={requestRoom}>
          <Text>Request Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#026efd',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  roomList: {
    width: '100%',
  },
  roomItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 20,
  },
});

export default RoomRequestScreen;