import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import Background from './components/Background';
import BackButton from './components/BackButton';

const RoleUpdate = () => {
    const Navigation = useNavigation();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch user data from Firebase Firestore
        const fetchUsers = async () => {
            const usersRef = firebase.firestore().collection('users');
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
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
                // Optionally add navigation to user details screen or actions
            }}
        >
            <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.userEmail}>Email: {item.email}</Text>
            <Text style={styles.userRole}>Role: {item.role}</Text>
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
        </TouchableOpacity>
    );

    return (
        <Background>
            <BackButton goBack={Navigation.goBack} />
            <Text style={styles.heading}>Role Management</Text>
            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={item => item.id}
                style={styles.userList}
                showsVerticalScrollIndicator={false}
            />
        </Background>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: '12%',
        alignSelf: 'center',
    },
    userItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 19,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    userRole: {
        fontSize: 16,
        marginBottom: 10,
        color: '#888',
    },
    userList: {
        paddingHorizontal: 10,
        paddingBottom: 20,
        width:'100%'
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

export default RoleUpdate;