import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firebase } from '../config';

const AllIssuesScreen = () => {
  const [issues, setIssues] = useState([]);
  const [solveTexts, setSolveTexts] = useState({});

  useEffect(() => {
    fetchAllIssues();
  }, []);

  const fetchAllIssues = async () => {
    try {
      const allIssuesRef = firebase.firestore().collection('issues');
      const snapshot = await allIssuesRef.get();
      const fetchedIssues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIssues(fetchedIssues);
    } catch (error) {
      console.error('Error fetching all issues:', error);
    }
  };

  const solveIssue = async (issueId) => {
    const solveText = solveTexts[issueId];

    if (solveText.trim() === '') {
      Alert.alert('Error', 'Please enter a solution.');
      return;
    }

    try {
      await firebase.firestore().collection('issues').doc(issueId).update({
        solve: solveText,
        solved: true
      });

      Alert.alert('Success', 'Issue marked as solved.');
      setSolveTexts(prev => ({ ...prev, [issueId]: '' }));
      fetchAllIssues(); // Refresh the issues list
    } catch (error) {
      console.error('Error solving issue:', error);
      Alert.alert('Error', 'An error occurred while solving the issue.');
    }
  };

  const handleSolveTextChange = (text, issueId) => {
    setSolveTexts(prev => ({ ...prev, [issueId]: text }));
  };

  const renderIssueItem = ({ item }) => (
    <View style={styles.issueItem}>
      <Text style={styles.issueText}>Room ID: {item.roomId}</Text>
      <Text style={styles.issueText}>Issue: {item.issue}</Text>
      <Text style={styles.issueText}>Solved: {item.solved ? 'Yes' : 'No'}</Text>
      {item.solved && <Text style={styles.issueText}>Solution: {item.solve}</Text>}
      {!item.solved && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter solution"
            value={solveTexts[item.id] || ''}
            onChangeText={(text) => handleSolveTextChange(text, item.id)}
          />
          <TouchableOpacity style={styles.solveButton} onPress={() => solveIssue(item.id)}>
            <Text style={styles.buttonText}>Mark as Solved</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Issues</Text>
      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        renderItem={renderIssueItem}
        ListEmptyComponent={<Text style={styles.noIssuesText}>No issues found.</Text>}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  solveButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noIssuesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default AllIssuesScreen;