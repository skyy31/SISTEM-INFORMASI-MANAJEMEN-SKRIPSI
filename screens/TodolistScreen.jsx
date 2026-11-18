import { useContext, useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CounterContext } from '../context/CounterContext';

export default function TodolistScreen({ navigation }) {
  const { count, tambah } = useContext(CounterContext);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // GET: Ambil data todo dari server
  async function getTodos() {
    const response = await fetch('http://10.0.2.2:3001/todos'); //[cite: 1]
    const data = await response.json();
    setTodos(data);
  }

  // POST: Tambah todo baru
  async function addTodos() {
    if (!text.trim()) return;

    await fetch('http://10.0.2.2:3001/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text, completed: false }),
    });

    setText(''); // Kosongkan input
    getTodos();  // Ambil ulang data agar list langsung terbarui
  }

  // DELETE: Hapus todo berdasarkan ID
  async function deleteTodos(id) {
    await fetch(`http://10.0.2.2:3001/todos/${id}`, {
      method: 'DELETE',
    });

    getTodos(); // Ambil ulang data agar list langsung terbarui
  }

  // Ambil data otomatis saat layar pertama kali dimuat
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ textAlign: 'center' }}>To Do List</Text>
      <Text style={{ textAlign: 'center' }}>Counter: {count}</Text>
      <Button title="Tambah" onPress={tambah} />

      {/* Form input + tombol submit (POST) */}
      <TextInput
        placeholder="Tulis todo..."
        value={text}
        onChangeText={setText}
        style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
      />
      <Button title="Submit" onPress={addTodos} />

      {/* List Todo + Tombol Hapus */}
      <FlatList
        data={todos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: '#ccc',
            }}>
            <Text style={{ flex: 1 }}>
              {item.completed ? '[x]' : '[ ]'} {item.title}
            </Text>

            {/* Tombol Hapus */}
            <TouchableOpacity
              onPress={() => deleteTodos(item.id)}
              style={{ backgroundColor: 'red', padding: 6, borderRadius: 4 }}>
              <Text style={{ color: 'white' }}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button
        title="Kembali ke Home"
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
}