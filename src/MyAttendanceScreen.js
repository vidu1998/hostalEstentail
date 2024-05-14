import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebase } from '../config';

const MyAttendanceScreen = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const attendanceRef = firebase.firestore().collection('attendance');
      const snapshot = await attendanceRef.where('userId', '==', userId).get();
      const fetchedAttendance = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const updatedAttendance = await fetchRoomInfo(fetchedAttendance);
      setAttendanceRecords(updatedAttendance);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Room: {item.room ? item.room.name : 'Unknown Room'}</Text>
      <Text>Date and Time: {item.datetime.toDate().toString()}</Text>
      <Text>Present: {item.present ? 'Yes' : 'No'}</Text>
    </View>
  );

  const fetchRoomInfo = async (attendanceRecords) => {
    const updatedAttendanceRecords = [];
    for (const record of attendanceRecords) {
      const roomData = await fetchRoomInfoFromFirestore(record.roomId);
      updatedAttendanceRecords.push({
        ...record,
        room: roomData
      });
    }
    return updatedAttendanceRecords;
  };

  const fetchRoomInfoFromFirestore = async (roomId) => {
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
      <Text style={styles.title}>My Attendance Records</Text>
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

export default MyAttendanceScreen;