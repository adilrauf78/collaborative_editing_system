// src/services/versionService.js
import axios from "axios";
import { getDocument } from "./documentService";

const API_URL = "http://localhost:8080/api/v1/version";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const addVersion = async (documentId, content, notes) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token missing");
  if (!documentId) throw new Error("Document ID missing");

  const { data } = await axios.post(
    `${API_URL}/add`,
    { documentId, content, notes },
    getAuthHeaders()
  );
  return data;
};

export const getVersions = async (documentId) => {
  if (!documentId) throw new Error("Document ID missing");
  const { data } = await axios.get(`${API_URL}/${documentId}/versions`, getAuthHeaders());
  return data;
};

export const revertVersion = async (versionId) => {
  if (!versionId) throw new Error("Version ID missing");
  const { data } = await axios.post(`${API_URL}/revert/${versionId}`, {}, getAuthHeaders());
  return data;
};

// Optional: get latest document content
export const getDocumentContent = async (documentId) => {
  const token = localStorage.getItem("token");
  const res = await getDocument(documentId, token);
  if (res.data.success) return res.data.document.content;
  return "";
};
