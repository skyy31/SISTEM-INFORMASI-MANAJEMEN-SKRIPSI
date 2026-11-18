import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

export default function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const userURL = 'https://jsonplaceholder.typicode.com/users';
        const postURL = 'https://jsonplaceholder.typicode.com/posts';

        //promise
        const [usersResponse, postsResponse] = await Promise.all([
          fetch(userURL),
          fetch(postURL)
        ]);

      // Mengubah response HTTP langsung menjadi data JSON secara paralel menggunakan Promise.all
      const [usersData, postsData] = await Promise.all([
       usersResponse.json(),
       postsResponse.json()
      ]);


      setUsers(usersData);
      setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Daftar Pengguna</Text>
        
        {users.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        ))}

        <Text style={[styles.title, styles.sectionTitle]}>Daftar Postingan</Text>

        {/* Menampilkan 10 post pertama agar layar tidak terlalu penuh */}
        {posts.slice(0, 1000).map((post) => (
          <View key={post.id} style={styles.card}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postBody}>{post.body}</Text>
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
  sectionTitle: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
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
  postTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
  },
});