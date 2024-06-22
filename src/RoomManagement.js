import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import Background from './components/Background';
import BackButton from './components/BackButton';

const RoomManagement = () => {
  const Navigation = useNavigation();

  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: '',
    taken: '',
    availability: '',
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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
    if (!validateRoomInput(newRoom)) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }

    try {
      const roomRef = await firebase.firestore().collection('rooms').add(newRoom);
      setRooms(prevRooms => [...prevRooms, { id: roomRef.id, ...newRoom }]);
      setNewRoom({
        name: '',
        capacity: '',
        taken: '',
        availability: '',
      });
      setIsAddModalVisible(false);
      Alert.alert('Success', 'Room created successfully.');
      fetchRooms(); // Refresh room list
    } catch (error) {
      Alert.alert('Error', 'Failed to create room: ' + error.message);
    }
  };

  const updateRoom = async () => {
    if (!validateRoomInput(selectedRoom)) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }

    try {
      await firebase.firestore().collection('rooms').doc(selectedRoom.id).update(selectedRoom);
      const updatedRooms = rooms.map(room => room.id === selectedRoom.id ? selectedRoom : room);
      setRooms(updatedRooms);
      setSelectedRoom(null);
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Room updated successfully.');
      fetchRooms(); // Refresh room list
    } catch (error) {
      Alert.alert('Error', 'Failed to update room: ' + error.message);
    }
  };

  const validateRoomInput = (room) => {
    return room.name.trim() !== '' &&
           room.capacity.trim() !== '' &&
           room.taken.trim() !== '' &&
           room.availability.trim() !== '';
  };

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => {
        setSelectedRoom(item);
        setIsEditModalVisible(true);
      }}
    >
      <Text style={styles.roomName}>Room Name: {item.name}</Text>
      <Text>Capacity: {item.capacity}</Text>
      <Text>Taken: {item.taken}</Text>
      <Text>Availability: {item.availability}</Text>
    </TouchableOpacity>
  );

  return (
    <Background>
      <BackButton goBack={Navigation.goBack} />
      <Text style={styles.heading}>Room Management</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
        <Text>Add Room</Text>
      </TouchableOpacity>

      {/* Add Room Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Add New Room</Text>
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
            <TouchableOpacity style={styles.button} onPress={createRoom}>
              <Text>Add Room</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIsAddModalVisible(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Room Modal */}
      {selectedRoom && (
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Edit Room</Text>
              <TextInput
                style={styles.input}
                value={selectedRoom.name}
                onChangeText={text => setSelectedRoom({ ...selectedRoom, name: text })}
                placeholder="Room Name"
              />
              <TextInput
                style={styles.input}
                value={selectedRoom.capacity.toString()}  // Convert numeric value to string
                onChangeText={text => setSelectedRoom({ ...selectedRoom, capacity: text })}
                keyboardType="numeric"
                placeholder="Capacity"
              />
              <TextInput
                style={styles.input}
                value={selectedRoom.taken.toString()}  // Convert numeric value to string
                onChangeText={text => setSelectedRoom({ ...selectedRoom, taken: text })}
                keyboardType="numeric"
                placeholder="Taken"
              />
              <TextInput
                style={styles.input}
                value={selectedRoom.availability.toString()}  // Convert numeric value to string
                onChangeText={text => setSelectedRoom({ ...selectedRoom, availability: text })}
                keyboardType="numeric"
                placeholder="Availability"
              />
              <TouchableOpacity style={styles.button} onPress={updateRoom}>
                <Text>Update Room</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setIsEditModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Room List */}
      <FlatList
        data={rooms}
        renderItem={renderRoomItem}
        keyExtractor={item => item.id}
        style={styles.roomList}
        showsVerticalScrollIndicator={false}
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 35,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#026efd',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    width: '50%',
    alignSelf: 'center',
  },
  roomList: {
    width: '100%',
    marginTop: '5%',
    paddingHorizontal: '5%',
  },
  roomItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    elevation: 3, // Add elevation for a card-like effect
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#026efd',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
});

export default RoomManagement;
