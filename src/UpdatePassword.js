import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native';
import Background from './components/Background';
import BackButton from './components/BackButton';


const UpdatePassword = () => {
  const Navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
  
    const handleChange = (name, value) => {
      if (name === 'currentPassword') setCurrentPassword(value);
      else if (name === 'newPassword') setNewPassword(value);
      else if (name === 'confirmPassword') setConfirmPassword(value);
    };
  
    const handleSubmit = async () => {
      setError(null);
      setSuccess(false);
  
      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        setError('New password and confirm password do not match.');
        return;
      }
  
      try {
        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (error) {
        setError(error.message);
      }
    };

  return (
    <Background>
            <BackButton goBack={Navigation.goBack} />
      <Text style={styles.heading}>Update Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={(text) => handleChange('currentPassword', text)}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="New Password"
        value={newPassword}
        onChangeText={(text) => handleChange('newPassword', text)}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
      />
      <Button title="Update Password" onPress={handleSubmit} />
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>Password updated successfully!</Text>}

   </Background>
  )
}

export default UpdatePassword

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    heading: {
      fontSize: 24,
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    error: {
      color: 'red',
      marginTop: 10,
    },
    success: {
      color: 'green',
      marginTop: 10,
    },
  }); 