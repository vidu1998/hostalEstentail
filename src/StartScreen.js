import React, { useEffect } from 'react';

import Background from './components/Background'
import Logo from './components/Logo'
import Header from './components/Header'
import Button from './components/Button'
import Paragraph from './components/Paragraph'
import { useNavigation } from '@react-navigation/native'
// Import AsyncStorage from @react-native-async-storage/async-storage

export default function StartScreen() {
  const Navigation = useNavigation();

  useEffect(() => {
 
  }, []);

 
  return (
    <Background>
      <Logo />
      <Header>Hostal essential App</Header>
        <Paragraph>
         All things about Hostal
        </Paragraph>
      <Button
        mode="contained"
        onPress={() => Navigation.navigate('Login')}
      >
        Log in
      </Button>
      <Button
        mode="outlined"
        onPress={() => Navigation.navigate('Registration')}
      >
        Create an account
      </Button>
    </Background>
  )
}