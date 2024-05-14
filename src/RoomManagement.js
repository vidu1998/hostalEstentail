import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { firebase } from '../config';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: '',
    taken: '',
    availability: '',
  });
  const [selectedRoom, setSelectedRoom] = useState(null);

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

  const createRoom = async () => {
    try {
      const roomRef = await firebase.firestore().collection('rooms').add(newRoom);
      setRooms(prevRooms => [...prevRooms, { id: roomRef.id, ...newRoom }]);
      setNewRoom({
        name: '',
        capacity: '',
        taken: '',
        availability: '',
      });
      Alert.alert('Success', 'Room created successfully.');
      fetchRooms(); // Refresh room list
    } catch (error) {
      Alert.alert('Error', 'Failed to create room: ' + error.message);
    }
  };

  const updateRoom = async () => {
    try {
      await firebase.firestore().collection('rooms').doc(selectedRoom.id).update(selectedRoom);
      const updatedRooms = rooms.map(room => room.id === selectedRoom.id ? selectedRoom : room);
      setRooms(updatedRooms);
      setSelectedRoom(null);
      Alert.alert('Success', 'Room updated successfully.');
      fetchRooms(); // Refresh room list
    } catch (error) {
      Alert.alert('Error', 'Failed to update room: ' + error.message);
    }
  };

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => setSelectedRoom(item)}
    >
      <Text>Room Name: {item.name}</Text>
      <Text>Capacity: {item.capacity}</Text>
      <Text>Taken: {item.taken}</Text>
      <Text>Availability: {item.availability}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Room Management</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Room Name"
          value={newRoom.name}
          onChangeText={text => setNewRoom({ ...newRoom, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Capacity"
          value={newRoom.capacity}
          onChangeText={text => setNewRoom({ ...newRoom, capacity: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Taken"
          value={newRoom.taken}
          onChangeText={text => setNewRoom({ ...newRoom, taken: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Availability"
          value={newRoom.availability}
          onChangeText={text => setNewRoom({ ...newRoom, availability: text })}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={createRoom}>
          <Text>Add Room</Text>
        </TouchableOpacity>
      </View>
      {selectedRoom && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={selectedRoom.name}
            onChangeText={text => setSelectedRoom({ ...selectedRoom, name: text })}
          />
          <TextInput
            style={styles.input}
            value={selectedRoom.capacity}
            onChangeText={text => setSelectedRoom({ ...selectedRoom, capacity: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={selectedRoom.taken}
            onChangeText={text => setSelectedRoom({ ...selectedRoom, taken: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={selectedRoom.availability}
            onChangeText={text => setSelectedRoom({ ...selectedRoom, availability: text })}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.updateButton} onPress={updateRoom}>
            <Text>Update Room</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={rooms}
        renderItem={renderRoomItem}
        keyExtractor={item => item.id}
        style={styles.roomList}
      />
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
    marginBottom: 20,
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
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#00FF00',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
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

export default RoomManagement;