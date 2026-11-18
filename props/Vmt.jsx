import React from 'react';
import { View, Image, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>VMT UNKLAB</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.body}>
          <Image
            source={require('./images/unklab logo.png')}
            style={styles.Image}
          />
        </View>

        <Text style={styles.title}>Visi</Text>

        <Text style={styles.paragraph}>
          Menjadi universitas swasta Kristen Masehi Advent Hari Ketujuh yang
          memperoleh pengakuan secara nasional, dan internasional melalui
          pendidikan dan pengajaran, penelitian, dan pengabdian kepada
          masyarakat yang bermutu dengan dilandasi pada suatu proses
          pengembangan yang serasi yakni spiritual, intelektual, fisik dan
          sosial.
        </Text>

        <Text style={styles.title}>Misi</Text>

        <Text style={styles.paragraph}>
          Universitas Klabat bertekad mencapai keunggulan mutu dalam pendidikan
          Kristen Masehi Advent Hari Ketujuh dengan menciptakan lingkungan yang
          kondusif untuk pengembangan karakter Kristiani yang mulia dan untuk
          pembekalan ketrampilan dan ilmu pengetahuan kepada mahasiswa agar
          bisa menjadi warga negara yang mampu hidup mandiri dan bekerja untuk
          melayani sesama manusia tanpa mementingkan diri sendiri.
        </Text>

        <Text style={styles.title}>Tujuan</Text>

        <Text style={styles.paragraph}>
          Berdasarkan pernyataan Visi dan Misi, Universitas Klabat berupaya
          mencapai tujuan-tujuan berikut:
        </Text>

        <Text style={styles.number}>
          1. Menuntun mahasiwa dalam pembentukan karakter Kristiani yang
          ditandai dengan kerajinan, kejujuran, penghematan, pengendalian-diri,
          dan kekudusan.
        </Text>

        <Text style={styles.number}>
          2. Memanfaatkan hasil penelitian dan teknologi semaksimal mungkin
          untuk memastikan pembelajaran yang bersifat student-centered dan
          student-oriented.
        </Text>

        <Text style={styles.number}>
          3. Membekali mahasiswa dengan ketrampilan dan penerapan ilmu
          pengetahuan dan teknologi yang ditekuninya.
        </Text>

        <Text style={styles.number}>
          4. Meningkatkan penelitian dosen dengan melibatkan mahasiswa.
        </Text>

        <Text style={styles.number}>
          5. Menerapkan ilmu pengetahuan dan teknologi semaksimal mungkin dalam
          bentuk pengabdian kepada masyarakat dengan melibatkan dosen, staf,
          dan mahasiswa.
        </Text>
      </ScrollView>

      <View style={styles.bottom}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefe8',
  },

  header: {
    height: 80,
    backgroundColor: '#615ee8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 32,
    color: 'white',
    fontWeight: '400',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 280,
    paddingBottom: 30,
  },

  body: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  Image: {
    width: 200,
    height: 200,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 10,
  },

  paragraph: {
    fontSize: 20,
    lineHeight: 27,
    textAlign: 'center',
    marginBottom: 15,
  },

  number: {
    fontSize: 20,
    lineHeight: 27,
    textAlign: 'center',
    marginBottom: 10,
  },

  bottom: {
    height: 60,
    backgroundColor: '#615ee8',
  },
});

export default App;