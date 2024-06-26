import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { firebase } from "./config";

import Login from './src/Login';
import Registration from "./src/Registration";
import Dashboard from "./src/Dashboard";
import Header from "./components/Header";
import RoleUpdate from "./src/RoleUpdate";
import UpdatePassword from "./src/UpdatePassword";
import RoomManagement from "./src/RoomManagement";
import RoomRequestScreen from "./src/RoomRequestScreen";
import VerifyRoomRequestScreen from "./src/VerifyRoomRequestScreen";
import MyRoomScreen from "./src/MyRoomScreen";
import AttendanceScreen from "./src/AttendanceScreen";
import ViewAttendanceScreen from "./src/ViewAttendanceScreen";
import MyAttendanceScreen from "./src/MyAttendanceScreen";
import IssueComplainScreen from "./src/IssueComplainScreen";
import IssueViewScreen from "./src/IssueViewScreen";
import AllIssuesScreen from "./src/AllIssuesScreen";
import StartScreen from "./src/StartScreen";
import ProfileUpdate from "./src/ProfileUpdate";


const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user State Changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const Navigation = useNavigation();

  useEffect(() => {
    
  }, [Navigation, user]);

  if (initializing) return null;

  if (!user) {
    return (
      <Stack.Navigator>
          <Stack.Screen 
          name="StartScreen"
          component={StartScreen}  
          options={{headerShown: false   }}
            // This line hides the header
/>
        
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false   }}
        ></Stack.Screen>

        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{headerShown: false   }}
        ></Stack.Screen>
      </Stack.Navigator>
    );
  }

  const screens = [
    <Stack.Screen
      key="Dashboard"
      name="Dashboard"
      component={Dashboard}
      options={{headerShown: false   }}

    />,
    <Stack.Screen
      key="RoleUpdate"
      name="RoleUpdate"
      component={RoleUpdate}
      options={{headerShown: false   }}
    />,
    <Stack.Screen
    key="ProfileUpdate"
    name="ProfileUpdate"
    component={ProfileUpdate}
    options={{headerShown: false   }}
  />,
    <Stack.Screen
      key="UpdatePassword"
      name="UpdatePassword"
      component={UpdatePassword}
      options={{headerShown: false   }}
    />,

    <Stack.Screen
    key="RoomManagement"
    name="RoomManagement"
    component={RoomManagement}
    options={{headerShown: false   }}
  />,


  <Stack.Screen
  key="RoomRequestScreen"
  name="RoomRequestScreen"
  component={RoomRequestScreen}
  options={{
    headerTitle: () => <Header name="Room Management" />,
    headerStyle: {
      height: 150,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      backgroundColor: '#00e440',
      shadowColor: '#000',
      elevation: 25,
    }
  }}
/>,
  <Stack.Screen
  key="VerifyRoomRequestScreen"
  name="VerifyRoomRequestScreen"
  component={VerifyRoomRequestScreen}
  options={{headerShown: false   }}
/>,
  <Stack.Screen
  key="MyRoomScreen"
  name="MyRoomScreen"
  component={MyRoomScreen}
  options={{
    headerTitle: () => <Header name="My Rooms" />,
    headerStyle: {
      height: 150,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      backgroundColor: '#00e440',
      shadowColor: '#000',
      elevation: 25,
    }
  }}
/>,
 <Stack.Screen
 key="AttendanceScreen"
 name="AttendanceScreen"
 component={AttendanceScreen}
 options={{
   headerTitle: () => <Header name="Attendance" />,
   headerStyle: {
     height: 150,
     borderBottomLeftRadius: 50,
     borderBottomRightRadius: 50,
     backgroundColor: '#00e440',
     shadowColor: '#000',
     elevation: 25,
   }
 }}
/>,
 <Stack.Screen
 key="ViewAttendanceScreen"
 name="ViewAttendanceScreen"
 component={ViewAttendanceScreen}
 options={{
   headerTitle: () => <Header name="All Attendance" />,
   headerStyle: {
     height: 150,
     borderBottomLeftRadius: 50,
     borderBottomRightRadius: 50,
     backgroundColor: '#00e440',
     shadowColor: '#000',
     elevation: 25,
   }
 }}
/>,

<Stack.Screen
key="MyAttendanceScreen"
name="MyAttendanceScreen"
component={MyAttendanceScreen}
options={{
  headerTitle: () => <Header name="My Attendance" />,
  headerStyle: {
    height: 150,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#00e440',
    shadowColor: '#000',
    elevation: 25,
  }
}}
/>,


<Stack.Screen
key="IssueComplainScreen"
name="IssueComplainScreen"
component={IssueComplainScreen}
options={{
  headerTitle: () => <Header name="Issue Complain" />,
  headerStyle: {
    height: 150,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#00e440',
    shadowColor: '#000',
    elevation: 25,
  }
}}
/>,
<Stack.Screen
key="IssueViewScreen"
name="IssueViewScreen"
component={IssueViewScreen}
options={{
  headerTitle: () => <Header name=" my Issue List" />,
  headerStyle: {
    height: 150,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#00e440',
    shadowColor: '#000',
    elevation: 25,
  }
}}
/>,
<Stack.Screen
key="AllissueScreen"
name="AllissueScreen"
component={AllIssuesScreen}
options={{
  headerTitle: () => <Header name="Issue solve" />,
  headerStyle: {
    height: 150,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#00e440',
    shadowColor: '#000',
    elevation: 25,
  }
}}
/>,
  ];

 

  return (
    <Stack.Navigator>
      {screens}
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App></App>
    </NavigationContainer>
  )
}
