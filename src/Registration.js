import { View, Text ,TouchableOpacity,TextInput,StyleSheet} from 'react-native'
import React,{useState} from 'react'
 import { firebase } from '../config'
const Registration = () => {
   const[email,setEmail]=useState('')
   const[password,setPassword]=useState('')
   const[firstName,setFirstName]=useState('')
   const[lastName,setLastName]=useState('')
   const[role,setRole]=useState('user')

   registerUser=async(email,password,firstName,lastName,role)=>{
    await firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(()=>{
      firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp:true,
        url:'https://hostal-636e6.firebaseapp.com'
      })
      .then(()=>{
        alert('Verfication email Sent')
      }).catch((error)=>{
        alert(error.message)
      })
      .then(()=>{
        firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          firstName,
          lastName,
          email,
          role,
        })
      })
      .catch((error)=>{
        alert(error.message)
      })
    })

    .catch((error)=>{
      alert(error.message)
    })
   }
   return(
    <View style={styles.container}>
      <Text style={{fontWeight:'bold',fontSize:23}}>Register Here..!!</Text>

      <View style={{marginTop:40}}>
        <TextInput
        style={styles.textInput}
        placeholder='First Name'
        onChangeText={(firstName)=>setFirstName(firstName)}
        autoCapitalize='none'
        autoCorrect={false}
        ></TextInput>
         <TextInput
        style={styles.textInput}
        placeholder='Last Name'
        onChangeText={(lastName)=>setLastName(lastName)}
        autoCapitalize='none'
        autoCorrect={false}
        ></TextInput>
            <TextInput
        style={styles.textInput}
        placeholder='Email'
        onChangeText={(email)=>setEmail(email)}
        autoCapitalize='none'
        autoCorrect={false}
        keyboardType='email-address'
        ></TextInput>

        <TextInput   
        
        style={styles.textInput}
        placeholder='Password'
        onChangeText={(password)=>setPassword(password)}
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={true}

        
        
        >  


        </TextInput>


      </View>

      <TouchableOpacity
        onPress={()=>registerUser(email,password,firstName,lastName,role)}
        style={styles.button}

      
      >
         <Text style={{fontWeight:'bold',fontSize:22}}>Register</Text>

      </TouchableOpacity>
    </View>
   )



}


export default Registration



const styles=StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    marginTop:100,

  },

  textInput:{
    paddingTop:20,
    paddingBottom:10,
    width:400,
    fontSize:20,
    borderBottomWidth:10,
    borderBottomColor:'#000',
    marginBottom:10,
    textAlign:'center',
  },

  button:{
    marginTop:50,
    height:70,
    width:250,
    backgroundColor:"#026efd",
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50
  }


})