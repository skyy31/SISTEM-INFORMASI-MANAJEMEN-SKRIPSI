import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [nimNip, setNimNip] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!nimNip.trim() || !password.trim()) {
      Alert.alert('Peringatan', 'Harap isi NIM/NIP dan Password.');
      return;
    }

    setSubmitting(true);
    const result = await login(nimNip.trim(), password.trim());
    setSubmitting(false);

    if (!result.success) {
      Alert.alert('Login Gagal', result.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Menggunakan logo yang sudah ada di folder images Anda */}
      
      <Text style={styles.title}>SIM SKRIPSI</Text>
      <Text style={styles.subtitle}>Sistem Informasi Manajemen Tugas Akhir</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>NIM / NIP / Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan NIM atau NIP"
          value={nimNip}
          onChangeText={setNimNip}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>MASUK</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>Akun Uji Coba (db.json):</Text>
        <Text style={styles.demoText}>• Mahasiswa: 105022010001 | Pass: 123</Text>
        <Text style={styles.demoText}>• Mahasiswa: 105022010002 | Pass: 123</Text>
        <Text style={styles.demoText}>• Mahasiswa: 105022010003 | Pass: 123</Text>
        <Text style={styles.demoText}>• Dosen: 198501012015 | Pass: 123</Text>
        <Text style={styles.demoText}>• Dosen: 198805122018 | Pass: 123</Text>
        <Text style={styles.demoText}>• Dosen: 198805122019 | Pass: 123</Text>
        <Text style={styles.demoText}>• Admin: admin | Pass: 123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 28,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 16,
    color: '#0F172A',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  demoBox: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
  },
  demoTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#334155',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 12,
    color: '#475569',
  },
});