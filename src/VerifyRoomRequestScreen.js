import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import Background from './components/Background';
import BackButton from './components/BackButton';

const VerifyRoomRequestScreen = () => {
  const Navigation = useNavigation();
  const [roomRequests, setRoomRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRoomRequests();
  }, []);

  const fetchRoomRequests = async () => {
    try {
      const roomRequestsRef = firebase.firestore().collection('room_requests');
      const snapshot = await roomRequestsRef.where('verified', '==', false).get();
      const fetchedRoomRequests = await Promise.all(snapshot.docs.map(async (doc) => {
        const roomRequestData = doc.data();
        // Fetch user details
        const userRef = firebase.firestore().collection('users').doc(roomRequestData.userId);
        const userSnapshot = await userRef.get();
        const userData = userSnapshot.data();
        return {
          id: doc.id,
          ...roomRequestData,
          userName: `${userData.firstName} ${userData.lastName}`
        };
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
        taken: roomData.taken + 1,
        availability: roomData.availability - 1
      });

      // Show success message
      Alert.alert('Success', 'Room request verified successfully.');

      // Fetch updated room requests
      fetchRoomRequests();
      // Close modal
      setModalVisible(false);
    } catch (error) {
      // Show error message
      Alert.alert('Error', 'Failed to verify room request: ' + error.message);
    }
  };

  const openVerifyModal = (item) => {
    setSelectedRequest(item);
    setModalVisible(true);
  };

  const renderRoomRequestItem = ({ item }) => (
    <TouchableOpacity style={styles.roomRequestItem} onPress={() => openVerifyModal(item)}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Room Name: {item.roomName}</Text>
        <Text style={styles.text}>Name: {item.userName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Background>
      <BackButton goBack={Navigation.goBack} />

      <Text style={styles.heading}>Verify Room Requests</Text>
      <FlatList
        data={roomRequests}
        renderItem={renderRoomRequestItem}
        keyExtractor={item => item.id}
        style={styles.roomRequestList}
      />

      {selectedRequest && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Verify Room Request</Text>
              <Text style={styles.modalText}>Room Name: {selectedRequest.roomName}</Text>
              <Text style={styles.modalText}>User Name: {selectedRequest.userName}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: '#026efd' }}
                  onPress={() => verifyRoomRequest(selectedRequest.id, selectedRequest.roomId)}
                >
                  <Text style={styles.textStyle}>Verify</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: '#ccc' }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </Background>
  );
};

const styles = StyleSheet.create({
  roomRequestItem: {
 
    padding: 20,
    borderRadius:5,
    padding: 20,
    marginBottom: 10,
    backgroundColor:"#E9E9E9"
  },
  textContainer: {
    flex: 1,
  },
  text: {
    marginBottom: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 35,
    textAlign: 'center',
  },
  roomRequestList: {
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    minWidth: 300,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  openButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VerifyRoomRequestScreen;