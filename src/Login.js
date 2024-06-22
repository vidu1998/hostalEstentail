import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet} from 'react-native';



import { Text, TextInput, Button } from 'react-native-paper'; // Assuming Text and Button are from react-native-paper
import Background from './components/Background';
import Logo from './components/Logo';
import Header from './components/Header';
import BackButton from './components/BackButton';
import { theme } from './core/theme';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const Login = () => {
  const Navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const loginUser = async (email, password) => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Fetch user role from the database
      const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.data();
      
      if (userData) {
        // Store user data in AsyncStorage
      // Assuming 'name' is a field in your user data
        
        // Redirect based on user role
        
      } else {
        // Handle missing user data
        alert('User data not found');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Background>
      <BackButton goBack={Navigation.goBack} />
      <Logo />
      <Header>Hostal Essential Login</Header>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        style={[styles.input, styles.emailInput]} // Add styles.emailInput to customize email input separately if needed
      />
      <View style={styles.passwordContainer}>
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password}
          onChangeText={(password) => setPassword(password)}
          secureTextEntry={secureTextEntry}
          style={[styles.input, styles.passwordInput]} // Add styles.passwordInput to customize password input separately if needed
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={togglePasswordVisibility}
        >
          <Text style={styles.icon}>{secureTextEntry ? '👁️' : '🔒'}</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={() => loginUser(email, password)} style={styles.button}>
        Log in
      </Button>
      <View style={styles.row}>
        <Text>You do not have an account yet?</Text>
        <TouchableOpacity onPress={() => Navigation.navigate('Registration')}>
          <Text style={styles.link}> Create!</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    width: '100%', // Set width to 100% to expand across the screen
    paddingHorizontal: 20, // Add horizontal padding for better appearance
    backgroundColor: 'white', // Optional: Adjust background color as needed
    borderRadius: 8, // Optional: Add border radius for rounded corners
    height: 50, // Optional: Adjust height as needed
  },
  emailInput: {
    // Additional styles specific to email input if needed
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.placeholder,
    marginBottom: 10,
  },
  iconButton: {
    position: 'absolute',
    right: 0,
    height: '100%', // Ensure icon button covers the entire height of the password input
    justifyContent: 'center', // Center the icon vertically
    paddingHorizontal: 10, // Add padding to the icon button for touchable area
  },
  icon: {
    fontSize: 20,
    color: theme.colors.primary,
  },
  button: {
    marginTop: 20,
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

export default Login;