import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

export default function App() {
  const [users, setUsers] = useState([]);
  const [post, setPost] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const userURL = 'https://jsonplaceholder.typicode.com/users';
        const postURL = 'https://jsonplaceholder.typicode.com/posts';

        const [usersResponse, postsResponse] = await Promise.all([
          fetch(userURL),
          fetch(postURL)
        ]);

        const usersData = await usersResponse.json();
        const postsData = await postsResponse.json();

        setUsers(usersData);
        setPost(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Belajar Fetch API</Text>
        
        {users.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
    elevation: 2, // Bayangan khusus Android
    shadowColor: '#000', // Bayangan iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});