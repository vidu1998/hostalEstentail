import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { firebase } from '../config';

const IssueComplainScreen = () => {
  const [userId, setUserId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [issue, setIssue] = useState('');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid); 
        fetchUserRooms(user.uid);
      } else {
        // User is not logged in, handle this case if necessary
      }
    });

    return () => {
      unsubscribe(); // Cleanup function
    };
  }, []);

  const fetchUserRooms = async (uid) => {
    try {
      const userRoomsRef = firebase.firestore().collection('room_requests').where('userId', '==', uid).where('verified', '==', true);
      const snapshot = await userRoomsRef.get();
      const fetchedRooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(fetchedRooms);
    } catch (error) {
      console.error('Error fetching user rooms:', error);
    }
  };

  const submitIssue = async () => {
    if (selectedRoomId.trim() === '' || issue.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const issueData = {
        roomId: selectedRoomId,
        issue,
        userId,
        solve: '',
        solved: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await firebase.firestore().collection('issues').add(issueData);

      Alert.alert('Success', 'Issue submitted successfully.');
      setIssue('');
      setSelectedRoomId('');
    } catch (error) {
      console.error('Error submitting issue:', error);
      Alert.alert('Error', 'An error occurred while submitting the issue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Issue Complain</Text>
      <Text style={styles.label}>Select a Room</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.roomItem}>
            <Text style={styles.roomText}>Room Name: {item.roomName}</Text>
            <Text style={styles.roomText}>Room ID: {item.roomId}</Text>
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={() => setSelectedRoomId(item.id)}
            >
              <Text style={styles.buttonText}>Select Room</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {selectedRoomId ? (
        <View>
          <Text style={styles.selectedRoomText}>Selected Room ID: {selectedRoomId}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your issue"
            value={issue}
            onChangeText={setIssue}
            multiline={true}
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.submitButton} onPress={submitIssue}>
            <Text style={styles.buttonText}>Submit Issue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.selectRoomPrompt}>Please select a room to proceed.</Text>
      )}
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
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  roomItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  roomText: {
    fontSize: 16,
  },
  selectButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  selectedRoomText: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectRoomPrompt: {
    fontSize: 16,
    color: '#FF0000',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default IssueComplainScreen;