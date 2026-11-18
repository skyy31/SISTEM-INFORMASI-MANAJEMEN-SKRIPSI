import React, { createContext, useState } from 'react';
import { loginRequest } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (nim_nip, password) => {
    try {
      const users = await loginRequest(nim_nip, password);
      if (users && users.length > 0) {
        const loggedUser = users[0];
        setUser(loggedUser);
        return { success: true };
      } else {
        return { success: false, message: 'NIM/NIP atau Password salah!' };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Gagal terhubung ke server. Pastikan json-server berjalan!',
      };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};