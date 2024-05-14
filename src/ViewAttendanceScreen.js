import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebase } from '../config';

const ViewAttendanceScreen = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const attendanceRef = firebase.firestore().collection('attendance');
      const snapshot = await attendanceRef.get();
      const fetchedAttendance = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const updatedAttendance = await fetchUserAndRoomInfo(fetchedAttendance);
      setAttendanceRecords(updatedAttendance);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>User: {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown User'}</Text>
      <Text>Room: {item.room ? item.room.name : 'Unknown Room'}</Text>
      <Text>Date and Time: {item.datetime.toDate().toString()}</Text>
      <Text>Present: {item.present ? 'Yes' : 'No'}</Text>
    </View>
  );

  const fetchUserAndRoomInfo = async (attendanceRecords) => {
    const updatedAttendanceRecords = [];
    for (const record of attendanceRecords) {
      const userData = await fetchUserInfo(record.userId);
      const roomData = await fetchRoomInfo(record.roomId);
      updatedAttendanceRecords.push({
        ...record,
        user: userData,
        room: roomData
      });
    }
    return updatedAttendanceRecords;
  };

  const fetchUserInfo = async (userId) => {
    try {
      const userDoc = await firebase.firestore().collection('users').doc(userId).get();
      return userDoc.exists ? userDoc.data() : null;
    } catch (error) {
      console.error('Error fetching user information:', error);
      return null;
    }
  };

  const fetchRoomInfo = async (roomId) => {
    try {
      const roomDoc = await firebase.firestore().collection('rooms').doc(roomId).get();
      return roomDoc.exists ? roomDoc.data() : null;
    } catch (error) {
      console.error('Error fetching room information:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Records</Text>
      <FlatList
        data={attendanceRecords}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ViewAttendanceScreen;
