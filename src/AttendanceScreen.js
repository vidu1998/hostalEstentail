import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { firebase } from '../config';

const AttendanceScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [datetime, setDatetime] = useState(new Date());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = firebase.firestore().collection('users');
      const snapshot = await usersRef.get();
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const fetchRoomForUser = async (userId) => {
    try {
      const roomRequestsRef = firebase.firestore().collection('room_requests');
      const snapshot = await roomRequestsRef.where('userId', '==', userId).where('verified', '==', true).get();
      if (!snapshot.empty) {
        const room = snapshot.docs[0].data();
        setSelectedRoom({
          id: room.roomId,
          name: room.roomName
        });
      } else {
        setSelectedRoom(null);
        Alert.alert('No Room Found', 'No verified room found for the selected user.');
      }
    } catch (error) {
      console.error('Error fetching room:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    fetchRoomForUser(user.id);
  };

  const handleAttendanceSubmit = async () => {
    try {
      if (selectedUser && selectedRoom) {
        await firebase.firestore().collection('attendance').add({
          userId: selectedUser.id,
          roomId: selectedRoom.id,
          datetime,
          present: true // Assuming attendance is marked as present when submitted
        });
        Alert.alert('Success', 'Attendance recorded successfully.');
      } else {
        Alert.alert('Error', 'Please select user and room.');
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      Alert.alert('Error', 'Failed to record attendance. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <View style={styles.inputContainer}>
        <Text>Select User:</Text>
        <View style={styles.item}>
          {users.map(user => (
            <TouchableOpacity 
              key={user.id}
              onPress={() => handleUserSelection(user)}
              style={[styles.userItem, selectedUser && selectedUser.id === user.id && styles.selectedUser]}
            >
              <Text>{user.firstName} {user.lastName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text>Selected User:</Text>
        <Text>{selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'None'}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text>Selected Room:</Text>
        <Text>{selectedRoom ? selectedRoom.name : 'None'}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text>Date and Time:</Text>
        <TextInput
          style={styles.input}
          value={datetime.toString()}
          onChangeText={setDatetime}
          editable={false}
        />
      </View>
      <Button title="Submit Attendance" onPress={handleAttendanceSubmit} />
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
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedUser: {
    backgroundColor: 'lightblue', // Change this to the highlight color you prefer
  },
});

export default AttendanceScreen;
