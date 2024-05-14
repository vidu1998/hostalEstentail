import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native'

const RoleUpdate = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // Fetch user data from Firebase Firestore
    const fetchUsers = async () => {
        const usersRef = firebase.firestore().collection('users');

        console.log(usersRef);
        const snapshot = await usersRef.get();
        const fetchedUsers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setUsers(fetchedUsers);
    };
    fetchUsers();
}, []);


const updateUserRole = async (userId, role) => {
  try {
      await firebase.firestore().collection('users').doc(userId).update({ role });
      // Update the local state with the updated user role
      setUsers(prevUsers =>
          prevUsers.map(user => (user.id === userId ? { ...user, role } : user))
      );
      alert('User role updated successfully.');
  } catch (error) {
      alert('Failed to update user role: ' + error.message);
  }
};

const renderUserItem = ({ item }) => (
  <View style={styles.userItem}>
      <Text>{item.firstName} {item.lastName}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Role: {item.role}</Text>
      <View style={styles.roleButtons}>
          <TouchableOpacity
              style={styles.roleButton}
              onPress={() => updateUserRole(item.id, 'user')}
          >
              <Text>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.roleButton}
              onPress={() => updateUserRole(item.id, 'staff')}
          >
              <Text>Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.roleButton}
              onPress={() => updateUserRole(item.id, 'admin')}
          >
              <Text>Admin</Text>
          </TouchableOpacity>
      </View>
  </View>
);
return (
  <View style={styles.container}>
      <Text style={styles.heading}>User Management</Text>
      <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          style={styles.userList}
      />
  </View>
);
}



const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
  },
  userItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      padding: 20,
  },
  userList: {
      width: '100%',
  },
  roleButtons: {
      flexDirection: 'row',
      marginTop: 10,
  },
  roleButton: {
      marginRight: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: '#026efd',
      borderRadius: 5,
  },
});



export default RoleUpdate