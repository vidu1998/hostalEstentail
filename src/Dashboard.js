import React, { useState, useEffect } from 'react';
import { FlatList , View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Title, Appbar, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigation = useNavigation(); // Initialize useNavigation hook
  const [role, setRole] = useState(''); // State to hold user's role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firebase.firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .get();

        if (snapshot.exists) {
          const userData = snapshot.data();
          setRole(userData.role);  // Assuming role is a field in your user document
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

  const renderButtons = () => {
    switch (role) {
      case 'admin':
        return [
           { id: 1, name: 'Role Update', onPress: () => navigation.navigate('RoleUpdate'),iconName: 'id-badge'},
           { id: 1, name: 'Profile Update', onPress: () => navigation.navigate('ProfileUpdate'),iconName: 'user'},
              { id: 2, name: 'Update Password', onPress: () => navigation.navigate('UpdatePassword'), iconName: 'key'},
              { id: 3, name: 'Room Management', onPress: () => navigation.navigate('RoomManagement') ,iconName: 'building'},
              { id: 4, name: 'Room Request Verify', onPress: () => navigation.navigate('VerifyRoomRequestScreen'),iconName: 'building'},
              { id: 5, name: 'Attendance Marking', onPress: () => navigation.navigate('AttendanceScreen') ,iconName: 'calendar-check-o'},
              { id: 6, name: 'My Rooms', onPress: () => navigation.navigate('MyRoomScreen')  ,iconName: 'user'},

              { id: 7, name: 'All Attendance', onPress: () => navigation.navigate('ViewAttendanceScreen') ,iconName: 'calendar-check-o'},
              { id: 8, name: 'Issue Solver', onPress: () => navigation.navigate('AllissueScreen') , iconName: 'exclamation-triangle'},
        ];
      case 'user':
        return [
         { id: 1, name: 'Update Password', onPress: () => navigation.navigate('UpdatePassword') ,iconName: 'kiey'},
              { id: 2, name: 'Room Request', onPress: () => navigation.navigate('RoomRequestScreen') ,iconName: 'star'},
              { id: 3, name: 'My Rooms', onPress: () => navigation.navigate('MyRoomScreen')  ,iconName: 'user'},
              { id: 4, name: 'My Attendance', onPress: () => navigation.navigate('MyAttendanceScreen')  ,iconName: 'calendar-check-o'},
              { id: 5, name: 'Issue Complain', onPress: () => navigation.navigate('IssueComplainScreen')  ,iconName: 'exclamation-triangle'},
              { id: 6, name: 'My Issue List', onPress: () => navigation.navigate('IssueViewScreen')  ,iconName: 'exclamation-triangle'},
        ];
      case 'staff':
        return [
           { id: 1, name: 'Room Management', onPress: () => navigation.navigate('RoomManagement')  ,iconName: 'building'},
              { id: 2, name: 'Update Password', onPress: () => navigation.navigate('UpdatePassword')  ,iconName: 'key'},
              { id: 3, name: 'Room Request', onPress: () => navigation.navigate('RoomRequestScreen')  ,iconName: 'building'},
              { id: 4, name: 'Room Request Verify', onPress: () => navigation.navigate('VerifyRoomRequestScreen')  ,iconName: 'building'},
              { id: 5, name: 'My Rooms', onPress: () => navigation.navigate('MyRoomScreen')  ,iconName: 'building'},
              { id: 6, name: 'Attendance Marking', onPress: () => navigation.navigate('AttendanceScreen')  ,iconName: 'calendar-check-o'},
              { id: 7, name: 'All Attendance', onPress: () => navigation.navigate('ViewAttendanceScreen')  ,iconName: 'calendar-check-o'},
              { id: 8, name: 'Issue Complain', onPress: () => navigation.navigate('IssueComplainScreen')  ,iconName: 'exclamation-triangle'},
              { id: 9, name: 'Issue Solver', onPress: () => navigation.navigate('AllissueScreen') ,iconName: 'exclamation-triangle'},
            ];
        
      default:
        return [];
    }
  };
  
  


  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toLowerCase();
  };
  if (loading) {
    return <Text>Loading...</Text>;
  }
  const userRoleProducts = renderButtons();
  return (
    <>
        <Appbar.Header>
        <Appbar.Content title="Welcome" subtitle={`Hi, welcome! ${formatDate(currentTime)}`} />
      </Appbar.Header>

      <View style={styles.clockContainer}>
        <Clock />
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('./assets/hostalimg.png')} style={styles.image} />
      </View>
      <FlatList
          data={userRoleProducts}
          keyExtractor={(product) => product.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
        />
    </>
  );
};

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return <Text style={styles.clockText}>{formatTime(time)}</Text>;
};

const ProductCard = ({ product }) => {
  return (
    <TouchableOpacity onPress={product.onPress} style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.upperRow}>
            <View style={styles.iconContainer}>
              <Icon name={product.iconName} size={20} style={styles.icon} />
            </View>
          </View>
          <View style={styles.lowerRow}>
            <Title style={styles.title}>{product.name}</Title>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 40) / 2;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: '10%',
    paddingTop: 20,
  },
  clockContainer: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
  },
  clockText: {
    fontSize: 20,
    color: 'white',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  card: {
    width: cardWidth,
    marginBottom: 20,
    elevation: 4,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
    width: cardWidth,
  },
  cardContent: {
    flexDirection: 'column', // Change to column layout
    alignItems: 'center', // Center items vertically
    padding: 10, // Add padding
  },

  upperRow: {
    flex: 1, // Occupy the upper row
    justifyContent: 'center', // Center items horizontally
  },
  lowerRow: {
    flex: 1, // Occupy the lower row
    justifyContent: 'center', // Center items horizontally
  },
  iconContainer: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
  },
  roleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
export default Dashboard;