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
  getAllDosen,
  getJudulByUser,
  postJudul,
  getLogbookByUser,
  postLogbook,
  getSidangByUser,
  postPengajuanSidang,
} from '../../services/api';

export default function DashboardMhs() {
  const { user, logout } = useContext(AuthContext);
  const [tab, setTab] = useState('judul'); // 'judul' | 'logbook' | 'sidang'

  // State Dosen & Pengajuan Judul
  const [dosenList, setDosenList] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [judulList, setJudulList] = useState([]);
  const [judulBaru, setJudulBaru] = useState('');
  const [deskripsiBaru, setDeskripsiBaru] = useState('');

  // State Logbook
  const [logbookList, setLogbookList] = useState([]);
  const [bab, setBab] = useState('');
  const [catatanMhs, setCatatanMhs] = useState('');

  // State Sidang
  const [sidangList, setSidangList] = useState([]);
  const [jenisSidang, setJenisSidang] = useState('Seminar Proposal');

  // Cek apakah sudah ada judul + advisor yang di-ACC
  const judulAcc = judulList.find((item) => item.status === 'Diterima');

  const loadData = async () => {
    try {
      const [dosens, dataJudul, dataLog, dataSidang] = await Promise.all([
        getAllDosen(),
        getJudulByUser(user.id),
        getLogbookByUser(user.id),
        getSidangByUser(user.id),
      ]);
      setDosenList(dosens);
      setJudulList(dataJudul);
      setLogbookList(dataLog);
      setSidangList(dataSidang);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data dari server.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Kirim Pengajuan Judul + Advisor
  const handleAjukanJudul = async () => {
    if (!judulBaru.trim() || !deskripsiBaru.trim() || !selectedDosen) {
      Alert.alert('Peringatan', 'Lengkapi judul, deskripsi, dan pilih Dosen Advisor!');
      return;
    }
    try {
      await postJudul({
        userId: user.id,
        namaMahasiswa: user.nama,
        nim: user.nim_nip,
        judul: judulBaru,
        deskripsi: deskripsiBaru,
        dosenId: selectedDosen.id,
        namaDosen: selectedDosen.nama,
        status: 'Menunggu',
        catatanDosen: '',
      });
      setJudulBaru('');
      setDeskripsiBaru('');
      setSelectedDosen(null);
      Alert.alert('Sukses', 'Pengajuan judul & advisor berhasil dikirim!');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim pengajuan.');
    }
  };

  // 2. Kirim Logbook Bimbingan
  const handleKirimLogbook = async () => {
    if (!bab.trim() || !catatanMhs.trim()) {
      Alert.alert('Peringatan', 'Isi Bab dan materi bimbingan!');
      return;
    }
    try {
      await postLogbook({
        userId: user.id,
        namaMahasiswa: user.nama,
        dosenId: judulAcc.dosenId,
        namaDosen: judulAcc.namaDosen,
        tanggal: new Date().toISOString().split('T')[0],
        bab,
        catatanMahasiswa: catatanMhs,
        catatanDosen: '',
        status: 'Menunggu Review',
      });
      setBab('');
      setCatatanMhs('');
      Alert.alert('Sukses', 'Logbook bimbingan terkirim ke Advisor!');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim logbook.');
    }
  };

  // 3. Ajukan Sidang ke Admin
  const handleAjukanSidang = async () => {
    const sudahMenunggu = sidangList.some(
      (s) => s.jenisSidang === jenisSidang && s.status === 'Menunggu Jadwal'
    );
    if (sudahMenunggu) {
      Alert.alert('Info', `Pengajuan ${jenisSidang} Anda masih diproses Admin.`);
      return;
    }

    try {
      await postPengajuanSidang({
        userId: user.id,
        namaMahasiswa: user.nama,
        nim: user.nim_nip,
        judul: judulAcc.judul,
        dosenId: judulAcc.dosenId,
        namaDosen: judulAcc.namaDosen,
        jenisSidang,
        tanggal: '',
        jam: '',
        ruangan: '',
        status: 'Menunggu Jadwal',
      });
      Alert.alert('Sukses', `Pengajuan ${jenisSidang} berhasil dikirim ke Admin!`);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Gagal mengajukan sidang.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard Mahasiswa</Text>
          <Text style={styles.headerSub}>
            {user.nama} ({user.nim_nip})
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      {/* Navigasi 3 Tab */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'judul' && styles.tabActive]}
          onPress={() => setTab('judul')}>
          <Text style={[styles.tabText, tab === 'judul' && styles.tabTextActive]}>
            1. Judul & Advisor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'logbook' && styles.tabActive]}
          onPress={() => setTab('logbook')}>
          <Text style={[styles.tabText, tab === 'logbook' && styles.tabTextActive]}>
            2. Bimbingan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'sidang' && styles.tabActive]}
          onPress={() => setTab('sidang')}>
          <Text style={[styles.tabText, tab === 'sidang' && styles.tabTextActive]}>
            3. Sidang
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* ================= TAB 1: JUDUL & ADVISOR ================= */}
        {tab === 'judul' && (
          <View>
            {!judulAcc && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Ajukan Judul & Pilih Advisor</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Judul Skripsi"
                  value={judulBaru}
                  onChangeText={setJudulBaru}
                />
                <TextInput
                  style={[styles.input, { height: 70 }]}
                  placeholder="Deskripsi Singkat / Latar Belakang"
                  value={deskripsiBaru}
                  onChangeText={setDeskripsiBaru}
                  multiline
                />

                <Text style={styles.label}>Pilih Dosen Advisor:</Text>
                {dosenList.map((dsn) => (
                  <TouchableOpacity
                    key={dsn.id}
                    style={[
                      styles.dosenOption,
                      selectedDosen?.id === dsn.id && styles.dosenOptionSelected,
                    ]}
                    onPress={() => setSelectedDosen(dsn)}>
                    <Text
                      style={[
                        styles.dosenOptionText,
                        selectedDosen?.id === dsn.id && { color: '#1D4ED8', fontWeight: 'bold' },
                      ]}>
                      {selectedDosen?.id === dsn.id ? '● ' : '○ '}
                      {dsn.nama} ({dsn.prodi})
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.primaryBtn} onPress={handleAjukanJudul}>
                  <Text style={styles.primaryBtnText}>Kirim Pengajuan</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>Status Pengajuan Judul & Advisor</Text>
            {judulList.length === 0 ? (
              <Text style={styles.emptyText}>Belum ada pengajuan judul.</Text>
            ) : (
              judulList.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.itemTitle}>{item.judul}</Text>
                  <Text style={styles.itemSub}>Advisor: {item.namaDosen}</Text>
                  <Text style={styles.itemDesc}>{item.deskripsi}</Text>
                  <View style={styles.badgeRow}>
                    <Text
                      style={[
                        styles.badge,
                        item.status === 'Diterima'
                          ? styles.badgeSuccess
                          : item.status === 'Ditolak'
                          ? styles.badgeDanger
                          : styles.badgeWarning,
                      ]}>
                      Status: {item.status}
                    </Text>
                  </View>
                  {item.catatanDosen ? (
                    <Text style={styles.noteText}>Catatan Advisor: {item.catatanDosen}</Text>
                  ) : null}
                </View>
              ))
            )}
          </View>
        )}

        {/* ================= TAB 2: LOGBOOK BIMBINGAN ================= */}
        {tab === 'logbook' && (
          <View>
            {!judulAcc ? (
              <View style={styles.lockBox}>
                <Text style={styles.lockTitle}>Logbook Bimbingan Terkunci</Text>
                <Text style={styles.lockDesc}>
                  Menu logbook bimbingan akan otomatis terbuka setelah pengajuan Judul dan Dosen
                  Advisor Anda di-ACC (Diterima) oleh dosen pembimbing.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.infoBanner}>
                  <Text style={styles.infoBannerText}>
                    Advisor Aktif: <Text style={{ fontWeight: 'bold' }}>{judulAcc.namaDosen}</Text>
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Catat Bimbingan Baru</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Contoh: BAB I - Pendahuluan"
                    value={bab}
                    onChangeText={setBab}
                  />
                  <TextInput
                    style={[styles.input, { height: 70 }]}
                    placeholder="Uraian progres / pertanyaan untuk dosen"
                    value={catatanMhs}
                    onChangeText={setCatatanMhs}
                    multiline
                  />
                  <TouchableOpacity style={styles.primaryBtn} onPress={handleKirimLogbook}>
                    <Text style={styles.primaryBtnText}>Kirim Logbook Bimbingan</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Riwayat Bimbingan Mahasiswa - Dosen</Text>
                {logbookList.length === 0 ? (
                  <Text style={styles.emptyText}>Belum ada catatan bimbingan.</Text>
                ) : (
                  logbookList.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <Text style={styles.itemTitle}>
                        {item.bab} ({item.tanggal})
                      </Text>
                      <Text style={styles.itemDesc}>Mahasiswa: {item.catatanMahasiswa}</Text>
                      <Text style={styles.statusText}>Status: {item.status}</Text>
                      {item.catatanDosen ? (
                        <Text style={styles.noteText}>Balasan Dosen: {item.catatanDosen}</Text>
                      ) : null}
                    </View>
                  ))
                )}
              </>
            )}
          </View>
        )}

        {/* ================= TAB 3: PENGAJUAN SIDANG ================= */}
        {tab === 'sidang' && (
          <View>
            {!judulAcc ? (
              <View style={styles.lockBox}>
                <Text style={styles.lockTitle}>Pengajuan Sidang Belum Tersedia</Text>
                <Text style={styles.lockDesc}>
                  Anda baru dapat mengajukan sidang setelah judul dan advisor Anda disetujui.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Ajukan Sidang Tugas Akhir</Text>
                  <Text style={styles.itemSub}>Judul: {judulAcc.judul}</Text>
                  <Text style={styles.itemSub}>Advisor: {judulAcc.namaDosen}</Text>

                  <Text style={[styles.label, { marginTop: 10 }]}>Pilih Jenis Sidang:</Text>
                  {['Seminar Proposal', 'Seminar Hasil', 'Sidang Akhir / Skripsi'].map((jenis) => (
                    <TouchableOpacity
                      key={jenis}
                      style={[
                        styles.dosenOption,
                        jenisSidang === jenis && styles.dosenOptionSelected,
                      ]}
                      onPress={() => setJenisSidang(jenis)}>
                      <Text
                        style={[
                          styles.dosenOptionText,
                          jenisSidang === jenis && { color: '#1D4ED8', fontWeight: 'bold' },
                        ]}>
                        {jenisSidang === jenis ? '● ' : '○ '}
                        {jenis}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity style={styles.primaryBtn} onPress={handleAjukanSidang}>
                    <Text style={styles.primaryBtnText}>Ajukan Jadwal Sidang ke Admin</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Status & Jadwal Sidang Anda</Text>
                {sidangList.length === 0 ? (
                  <Text style={styles.emptyText}>Belum ada pengajuan sidang.</Text>
                ) : (
                  sidangList.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <Text style={styles.itemTitle}>{item.jenisSidang}</Text>
                      <Text style={styles.statusText}>Status: {item.status}</Text>
                      {item.status === 'Terjadwal' ? (
                        <View style={styles.scheduleBox}>
                          <Text style={styles.scheduleText}>Tanggal: {item.tanggal}</Text>
                          <Text style={styles.scheduleText}>Waktu: {item.jam}</Text>
                          <Text style={styles.scheduleText}>Ruangan: {item.ruangan}</Text>
                        </View>
                      ) : (
                        <Text style={styles.itemDesc}>
                          Menunggu Admin menentukan tanggal, jam, dan ruangan sidang.
                        </Text>
                      )}
                    </View>
                  ))
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#2563EB',
    padding: 16,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#DBEAFE', fontSize: 13 },
  logoutBtn: { backgroundColor: '#1E40AF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#FFF', fontWeight: 'bold' },
  tabRow: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderColor: '#2563EB' },
  tabText: { color: '#6B7280', fontWeight: '600', fontSize: 12 },
  tabTextActive: { color: '#2563EB' },
  content: { padding: 14 },
  card: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  dosenOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#F9FAFB',
  },
  dosenOptionSelected: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  dosenOptionText: { fontSize: 13, color: '#374151' },
  primaryBtn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold' },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  itemSub: { fontSize: 13, color: '#2563EB', fontWeight: '600', marginTop: 2 },
  itemDesc: { fontSize: 13, color: '#4B5563', marginVertical: 4 },
  badgeRow: { flexDirection: 'row', marginTop: 4 },
  badge: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeSuccess: { backgroundColor: '#D1FAE5', color: '#065F46' },
  badgeDanger: { backgroundColor: '#FEE2E2', color: '#991B1B' },
  badgeWarning: { backgroundColor: '#FEF3C7', color: '#92400E' },
  statusText: { fontSize: 13, fontWeight: 'bold', color: '#2563EB', marginTop: 4 },
  noteText: { fontSize: 13, color: '#059669', marginTop: 6, fontStyle: 'italic' },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 20 },
  lockBox: {
    backgroundColor: '#FEF3C7',
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginTop: 10,
  },
  lockTitle: { fontSize: 15, fontWeight: 'bold', color: '#92400E', marginBottom: 6 },
  lockDesc: { fontSize: 13, color: '#78350F', lineHeight: 19 },
  infoBanner: { backgroundColor: '#DBEAFE', padding: 10, borderRadius: 8, marginBottom: 10 },
  infoBannerText: { color: '#1E40AF', fontSize: 13 },
  scheduleBox: { backgroundColor: '#ECFDF5', padding: 10, borderRadius: 8, marginTop: 8 },
  scheduleText: { color: '#065F46', fontSize: 13, fontWeight: '600' },
});