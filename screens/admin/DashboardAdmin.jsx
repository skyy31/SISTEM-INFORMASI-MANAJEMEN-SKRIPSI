import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getAllUsers, getAllSidang, updateJadwalSidang } from '../../services/api';

export default function DashboardAdmin() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [sidangList, setSidangList] = useState([]);
  const [formJadwal, setFormJadwal] = useState({});

  const loadData = async () => {
    try {
      const [dataUsers, dataSidang] = await Promise.all([getAllUsers(), getAllSidang()]);
      setUsers(dataUsers);
      setSidangList(dataSidang);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data admin.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSetJadwal = async (item) => {
    const input = formJadwal[item.id] || {};
    const tanggal = input.tanggal || item.tanggal;
    const jam = input.jam || item.jam;
    const ruangan = input.ruangan || item.ruangan;

    if (!tanggal || !jam || !ruangan) {
      Alert.alert('Peringatan', 'Isi Tanggal, Jam, dan Ruangan sidang!');
      return;
    }

    try {
      await updateJadwalSidang(item.id, {
        tanggal,
        jam,
        ruangan,
        status: 'Terjadwal',
      });
      Alert.alert('Sukses', `Jadwal sidang untuk ${item.namaMahasiswa} berhasil ditetapkan!`);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan jadwal sidang.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard Admin</Text>
          <Text style={styles.headerSub}>{user.nama}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {users.filter((u) => u.role === 'mahasiswa').length}
            </Text>
            <Text style={styles.statLabel}>Mahasiswa</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{users.filter((u) => u.role === 'dosen').length}</Text>
            <Text style={styles.statLabel}>Dosen</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{sidangList.length}</Text>
            <Text style={styles.statLabel}>Pengajuan Sidang</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Atur Jadwal Sidang Mahasiswa</Text>
        {sidangList.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada pengajuan sidang dari mahasiswa.</Text>
        ) : (
          sidangList.map((item) => {
            const currentForm = formJadwal[item.id] || {};
            return (
              <View key={item.id} style={styles.card}>
                <Text style={styles.badgeJenis}>{item.jenisSidang}</Text>
                <Text style={styles.itemTitle}>
                  {item.namaMahasiswa} ({item.nim})
                </Text>
                <Text style={styles.itemDesc}>Judul: {item.judul}</Text>
                <Text style={styles.itemDesc}>Advisor: {item.namaDosen}</Text>
                <Text style={styles.statusText}>Status: {item.status}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Tanggal (contoh: 2026-11-25)"
                  value={currentForm.tanggal ?? item.tanggal}
                  onChangeText={(val) =>
                    setFormJadwal({
                      ...formJadwal,
                      [item.id]: { ...currentForm, tanggal: val },
                    })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Jam (contoh: 09:00 - 11:00 WITA)"
                  value={currentForm.jam ?? item.jam}
                  onChangeText={(val) =>
                    setFormJadwal({
                      ...formJadwal,
                      [item.id]: { ...currentForm, jam: val },
                    })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ruangan (contoh: Ruang Sidang FIK 201)"
                  value={currentForm.ruangan ?? item.ruangan}
                  onChangeText={(val) =>
                    setFormJadwal({
                      ...formJadwal,
                      [item.id]: { ...currentForm, ruangan: val },
                    })
                  }
                />

                <TouchableOpacity style={styles.primaryBtn} onPress={() => handleSetJadwal(item)}>
                  <Text style={styles.primaryBtnText}>Simpan & Tetapkan Jadwal</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#7C3AED',
    padding: 16,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#EDE9FE', fontSize: 13 },
  logoutBtn: { backgroundColor: '#5B21B6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#FFF', fontWeight: 'bold' },
  content: { padding: 14 },
  statRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#7C3AED' },
  statLabel: { fontSize: 12, color: '#4B5563' },
  card: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  badgeJenis: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FE',
    color: '#5B21B6',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  primaryBtn: { backgroundColor: '#7C3AED', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold' },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  itemDesc: { fontSize: 13, color: '#4B5563', marginTop: 2 },
  statusText: { fontSize: 13, fontWeight: 'bold', color: '#7C3AED', marginVertical: 6 },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 20 },
});