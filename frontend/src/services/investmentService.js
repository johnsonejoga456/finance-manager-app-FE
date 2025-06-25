// src/services/investmentService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/investments';

// Helper to include Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getInvestments = async (page = 1, limit = 10) => {
  const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, getAuthHeader());
  return res.data;
};

export const addInvestment = async (data) => {
  const res = await axios.post(API_URL, data, getAuthHeader());
  return res.data;
};

export const updateInvestment = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
  return res.data;
};

export const deleteInvestment = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return res.data;
};

export const exportCSV = async () => {
  const res = await axios.get(`${API_URL}/export/csv`, {
    ...getAuthHeader(),
    responseType: 'blob', // for downloading
  });
  return res.data;
};

export const exportPDF = async () => {
  const res = await axios.get(`${API_URL}/export/pdf`, {
    ...getAuthHeader(),
    responseType: 'blob',
  });
  return res.data;
};