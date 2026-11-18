const BASE_URL = 'http://10.0.2.2:3001';

// --- AUTH & USERS ---
export const loginRequest = async (nim_nip, password) => {
  const response = await fetch(`${BASE_URL}/users?nim_nip=${nim_nip}&password=${password}`);
  return await response.json();
};

export const getAllUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  return await response.json();
};

export const getAllDosen = async () => {
  const response = await fetch(`${BASE_URL}/users?role=dosen`);
  return await response.json();
};

// --- PENGAJUAN JUDUL & ADVISOR ---
export const getJudulByUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/pengajuanJudul?userId=${userId}`);
  return await response.json();
};

export const getJudulByDosen = async (dosenId) => {
  const response = await fetch(`${BASE_URL}/pengajuanJudul?dosenId=${dosenId}`);
  return await response.json();
};

export const postJudul = async (data) => {
  const response = await fetch(`${BASE_URL}/pengajuanJudul`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const updateStatusJudul = async (id, status, catatanDosen) => {
  const response = await fetch(`${BASE_URL}/pengajuanJudul/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, catatanDosen }),
  });
  return await response.json();
};

// --- LOGBOOK BIMBINGAN ---
export const getLogbookByUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/logbookBimbingan?userId=${userId}`);
  return await response.json();
};

export const getLogbookByDosen = async (dosenId) => {
  const response = await fetch(`${BASE_URL}/logbookBimbingan?dosenId=${dosenId}`);
  return await response.json();
};

export const postLogbook = async (data) => {
  const response = await fetch(`${BASE_URL}/logbookBimbingan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const updateReviewLogbook = async (id, status, catatanDosen) => {
  const response = await fetch(`${BASE_URL}/logbookBimbingan/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, catatanDosen }),
  });
  return await response.json();
};

// --- PENGAJUAN & JADWAL SIDANG ---
export const getAllSidang = async () => {
  const response = await fetch(`${BASE_URL}/jadwalSidang`);
  return await response.json();
};

export const getSidangByUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/jadwalSidang?userId=${userId}`);
  return await response.json();
};

export const postPengajuanSidang = async (data) => {
  const response = await fetch(`${BASE_URL}/jadwalSidang`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const updateJadwalSidang = async (id, payload) => {
  const response = await fetch(`${BASE_URL}/jadwalSidang/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await response.json();
};