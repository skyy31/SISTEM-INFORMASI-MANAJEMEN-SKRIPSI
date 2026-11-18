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
import {
  getJudulByDosen,
  updateStatusJudul,
  getLogbookByDosen,
  updateReviewLogbook,
} from '../../services/api';

export default function DashboardDosen() {
  const { user, logout } = useContext(AuthContext);
  const [tab, setTab] = useState('judul'); // 'judul' | 'logbook'
  const [judulList, setJudulList] = useState([]);
  const [logbookList, setLogbookList] = useState([]);
  const [catatanInput, setCatatanInput] = useState({});

  const loadData = async () => {
    try {
      const [dataJudul, dataLog] = await Promise.all([
        getJudulByDosen(user.id),
        getLogbookByDosen(user.id),
      ]);

      // Hanya tampilkan yang belum di-ACC (status masih 'Menunggu')
      const judulMenunggu = dataJudul.filter((item) => item.status === 'Menunggu');
      // Hanya tampilkan logbook yang belum di-ACC
      const logMenunggu = dataLog.filter((item) => item.status === 'Menunggu Review');

      setJudulList(judulMenunggu);
      setLogbookList(logMenunggu);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data bimbingan.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleKeputusanJudul = async (id, status) => {
    const catatan = catatanInput[id] || '';
    try {
      await updateStatusJudul(id, status, catatan);
      // Langsung hilangkan item dari daftar tampilan dosen
      setJudulList((prev) => prev.filter((item) => item.id !== id));
      Alert.alert('Sukses', `Pengajuan judul & advisor telah ${status}`);
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui status.');
    }
  };

  const handleReviewLogbook = async (id, status) => {
    const catatan = catatanInput[`log_${id}`] || 'Sudah diperiksa.';
    try {
      await updateReviewLogbook(id, status, catatan);
      // Langsung hilangkan logbook dari daftar tampilan dosen
      setLogbookList((prev) => prev.filter((item) => item.id !== id));
      Alert.alert('Sukses', 'Feedback bimbingan berhasil dikirim ke mahasiswa!');
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim feedback bimbingan.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard Dosen</Text>
          <Text style={styles.headerSub}>{user.nama}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'judul' && styles.tabActive]}
          onPress={() => setTab('judul')}>
          <Text style={[styles.tabText, tab === 'judul' && styles.tabTextActive]}>
            ACC Judul & Advisor ({judulList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'logbook' && styles.tabActive]}
          onPress={() => setTab('logbook')}>
          <Text style={[styles.tabText, tab === 'logbook' && styles.tabTextActive]}>
            Bimbingan Mahasiswa ({logbookList.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {tab === 'judul' ? (
          judulList.length === 0 ? (
            <Text style={styles.emptyText}>Tidak ada pengajuan judul & advisor baru.</Text>
          ) : (
            judulList.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.mhsLabel}>
                  Mahasiswa: {item.namaMahasiswa} ({item.nim})
                </Text>
                <Text style={styles.itemTitle}>{item.judul}</Text>
                <Text style={styles.itemDesc}>{item.deskripsi}</Text>
                <Text style={styles.statusText}>Status: {item.status}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Catatan / arahan untuk mahasiswa..."
                  value={catatanInput[item.id] ?? item.catatanDosen}
                  onChangeText={(text) => setCatatanInput({ ...catatanInput, [item.id]: text })}
                />

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                    onPress={() => handleKeputusanJudul(item.id, 'Diterima')}>
                    <Text style={styles.btnText}>ACC Judul & Advisor</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}
                    onPress={() => handleKeputusanJudul(item.id, 'Ditolak')}>
                    <Text style={styles.btnText}>Tolak</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        ) : logbookList.length === 0 ? (
          <Text style={styles.emptyText}>Tidak ada logbook bimbingan yang menunggu review.</Text>
        ) : (
          logbookList.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.mhsLabel}>
                Mahasiswa: {item.namaMahasiswa} | {item.tanggal}
              </Text>
              <Text style={styles.itemTitle}>{item.bab}</Text>
              <Text style={styles.itemDesc}>Progres Mahasiswa: {item.catatanMahasiswa}</Text>
              <Text style={styles.statusText}>Status: {item.status}</Text>

              <TextInput
                style={styles.input}
                placeholder="Tulis feedback / revisi bimbingan..."
                value={catatanInput[`log_${item.id}`] ?? item.catatanDosen}
                onChangeText={(text) =>
                  setCatatanInput({ ...catatanInput, [`log_${item.id}`]: text })
                }
              />

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#2563EB' }]}
                  onPress={() => handleReviewLogbook(item.id, 'ACC Bimbingan')}>
                  <Text style={styles.btnText}>ACC Bimbingan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]}
                  onPress={() => handleReviewLogbook(item.id, 'Perlu Revisi')}>
                  <Text style={styles.btnText}>Minta Revisi</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#059669',
    padding: 16,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#D1FAE5', fontSize: 13 },
  logoutBtn: { backgroundColor: '#065F46', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#FFF', fontWeight: 'bold' },
  tabRow: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderColor: '#059669' },
  tabText: { color: '#6B7280', fontWeight: '600', fontSize: 12 },
  tabTextActive: { color: '#059669' },
  content: { padding: 14 },
  card: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mhsLabel: { fontSize: 12, fontWeight: 'bold', color: '#059669', marginBottom: 4 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  itemDesc: { fontSize: 13, color: '#4B5563', marginVertical: 6 },
  statusText: { fontSize: 13, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 20 },
});