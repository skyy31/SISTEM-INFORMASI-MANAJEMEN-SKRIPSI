import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardMhs from '../screens/mahasiswa/DashboardMhs';
import DashboardDosen from '../screens/dosen/DashboardDosen';
import DashboardAdmin from '../screens/admin/DashboardAdmin';

export default function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (user.role === 'mahasiswa') {
    return <DashboardMhs />;
  }

  if (user.role === 'dosen') {
    return <DashboardDosen />;
  }

  return <DashboardAdmin />;
}