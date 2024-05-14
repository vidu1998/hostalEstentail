import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Dashboard = () => {
  const Navigation = useNavigation();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firebase.firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .get();

        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log('User does not exist');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error gracefully, e.g., display a message to the user
      } finally {
        setLoading(false); // Mark data loading as completed, whether successful or not
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.buttonsContainer}>
          
            <TouchableOpacity
              onPress={() => Navigation.navigate('RoleUpdate')}
              style={[styles.button, { backgroundColor: '#03A9F4' }]}
            >
              <Icon name="settings" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>Role Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Navigation.navigate('UpdatePassword')} 
              style={[styles.button, { backgroundColor: '#026efd' }]}
            >
              <Icon name="lock-closed-outline" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>Update Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Navigation.navigate('RoomManagement')} 
              style={[styles.button, { backgroundColor: '#026efd' }]}
            >
              <Icon name="lock-closed-outline" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>Room Management</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Navigation.navigate('RoomRequestScreen')} 
              style={[styles.button, { backgroundColor: '#026efd' }]}
            >
              <Icon name="lock-closed-outline" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>Room Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Navigation.navigate('VerifyRoomRequestScreen')} 
              style={[styles.button, { backgroundColor: '#026efd' }]}
            >
              <Icon name="lock-closed-outline" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>Room Request verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Navigation.navigate('MyRoomScreen')} 
              style={[styles.button, { backgroundColor: '#026efd' }]}
            >
              <Icon name="lock-closed-outline" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>My Rooms</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Navigation.navigate('AttendanceScreen')} 
              style={[styles.button, { backgroundColor: '#026efd' }]}
            >
              <Icon name="lock-closed-outline" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>Attendance Marking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Navigation.navigate('ViewAttendanceScreen')} 
              style={[styles.button, { backgroundColor: '#026efd' }]}
            >
              <Icon name="lock-closed-outline" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>All Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Navigation.navigate('MyAttendanceScreen')} 
              style={[styles.button, { backgroundColor: '#026efd' }]}
            >
              <Icon name="lock-closed-outline" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>My Attendance</Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.button}
              onPress={() => { firebase.auth().signOut(); }}
            >
              <Icon name="log-out" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { paddingLeft: 40 }]}>Sign out</Text>
            </TouchableOpacity>

          </View>
         
        )}
         </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  buttonsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    width: '90%',
    marginBottom: 20,
    backgroundColor: '#026efd',
    justifyContent: 'center',
    borderRadius: 50,
    paddingHorizontal: 50,
    alignSelf: 'center',
    // to accommodate absolute positioning of icon
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    position: 'absolute',
    left: 20,
  },
});