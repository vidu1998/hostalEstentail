import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import Background from './components/Background';
import Logo from './components/Logo';
import Header from './components/Header';
import BackButton from './components/BackButton';
import { theme } from './core/theme';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const Registration = () => {
  const Navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('user');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleConfirmPasswordVisibility = () => {
    setSecureConfirmTextEntry(!secureConfirmTextEntry);
  };

  const registerUser = async (email, password, firstName, lastName, role) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url: 'https://hostal-app-5aa90.firebaseapp.com'
      });
      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
        firstName,
        lastName,
        email,
        role,
      });
      alert('Verification email sent');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Background>
      <BackButton goBack={Navigation.goBack} />
      <Logo />
      <Header>Hostal Essential Register</Header>
      <View style={styles.passwordContainer}>
      <TextInput
        label="First Name"
        returnKeyType="next"
        onChangeText={(firstName) => setFirstName(firstName)}
        style={styles.input}
        
      />
        </View>
      <View style={styles.passwordContainer}>
      <TextInput
        label="Last Name"
        returnKeyType="next"
        onChangeText={(lastName) => setLastName(lastName)}
        style={styles.input}
      />
      </View>
          <View style={styles.passwordContainer}>
      <TextInput
        label="Email"
        returnKeyType="next"
        onChangeText={(email) => setEmail(email)}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        style={styles.input}
      />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          label="Password"
          returnKeyType="next"
          onChangeText={(password) => setPassword(password)}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
        <TouchableOpacity style={styles.iconButton} onPress={togglePasswordVisibility}>
          <Text style={styles.icon}>{secureTextEntry ? '👁️' : '🔒'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          label="Confirm Password"
          returnKeyType="done"
          onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
          secureTextEntry={secureConfirmTextEntry}
          style={styles.input}
        />
        <TouchableOpacity style={styles.iconButton} onPress={toggleConfirmPasswordVisibility}>
          <Text style={styles.icon}>{secureConfirmTextEntry ? '👁️' : '🔒'}</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={() => registerUser(email, password, firstName, lastName, role)} style={styles.button}>
        Register
      </Button>
      <View style={styles.row}>
        <Text>I already have an account!</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => Navigation.replace('Login')}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({


  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.placeholder,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 20,
  },
  iconButton: {
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    fontSize: 20,
    color: theme.colors.primary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'center',
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default Registration;
