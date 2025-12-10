import axios from "axios";

const API = "http://localhost:8080/api/v1/documents";

export const createDocument = async (data, token) => {
  return await axios.post(`${API}/create`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getUserDocuments = async (token) => {
  return await axios.get(`${API}/getall`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getDocument = async (id, token) => {
  return await axios.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateDocument = async (id, data, token) => {
  return await axios.put(`${API}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


