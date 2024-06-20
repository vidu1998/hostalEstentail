import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebase } from '../config';

const IssueViewScreen = () => {
  const [userId, setUserId] = useState('');
  const [solvedIssues, setSolvedIssues] = useState([]);
  const [unsolvedIssues, setUnsolvedIssues] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid); 
        fetchUserIssues(user.uid);
      } else {
        // User is not logged in, handle this case if necessary
      }
    });

    return () => {
      unsubscribe(); // Cleanup function
    };
  }, []);

  const fetchUserIssues = async (uid) => {
    try {
      const userIssuesRef = firebase.firestore().collection('issues').where('userId', '==', uid);
      const snapshot = await userIssuesRef.get();
      const fetchedIssues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const solved = fetchedIssues.filter(issue => issue.solved);
      const unsolved = fetchedIssues.filter(issue => !issue.solved);
      setSolvedIssues(solved);
      setUnsolvedIssues(unsolved);
    } catch (error) {
      console.error('Error fetching user issues:', error);
    }
  };

  const renderIssueItem = ({ item }) => (
    <View style={styles.issueItem}>
      <Text style={styles.issueText}>Room ID: {item.roomId}</Text>
      <Text style={styles.issueText}>User ID: {item.userId}</Text>
      <Text style={styles.issueText}>Issue: {item.issue}</Text>
      <Text style={styles.issueText}>Solved: {item.solved ? 'Yes' : 'No'}</Text>
      {item.solve && <Text style={styles.issueText}>Solution: {item.solve}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Issues</Text>
      
      <Text style={styles.sectionTitle}>Unsolved Issues</Text>
      <FlatList
        data={unsolvedIssues}
        keyExtractor={(item) => item.id}
        renderItem={renderIssueItem}
        ListEmptyComponent={<Text style={styles.noIssuesText}>No unsolved issues.</Text>}
      />
      
      <Text style={styles.sectionTitle}>Solved Issues</Text>
      <FlatList
        data={solvedIssues}
        keyExtractor={(item) => item.id}
        renderItem={renderIssueItem}
        ListEmptyComponent={<Text style={styles.noIssuesText}>No solved issues.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  issueItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  issueText: {
    fontSize: 16,
  },
  noIssuesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default IssueViewScreen;