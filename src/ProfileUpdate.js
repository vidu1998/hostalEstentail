import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import Background from './components/Background';
import BackButton from './components/BackButton';
const ProfileUpdate = () => {
  const Navigation = useNavigation();
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    // Fetch current user data from Firebase Authentication
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      // Fetch additional user data from Firestore
      firebase.firestore().collection('users').doc(currentUser.uid).get()
        .then(doc => {
          if (doc.exists) {
            setUser(prevUser => ({
              ...prevUser,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName
            }));
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  const updateUserProfile = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        await currentUser.updateEmail(user.email);
        await firebase.firestore().collection('users').doc(currentUser.uid).update({
          firstName: user.firstName,
          lastName: user.lastName
        });
        alert('Profile updated successfully.');
      }
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  };

  const handleChange = (key, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [key]: value
    }));
  };

  return (
    <Background>
            <BackButton goBack={Navigation.goBack} />
   
      <Text style={styles.heading}>Profile Update</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={user.email}
          onChangeText={text => handleChange('email', text)}
          editable={false} // Disable editing email field
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={user.firstName}
          onChangeText={text => handleChange('firstName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={user.lastName}
          onChangeText={text => handleChange('lastName', text)}
        />
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={updateUserProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
   </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  inputContainer: {
    width: '100%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  updateButton: {
    backgroundColor: '#026efd',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default ProfileUpdate;