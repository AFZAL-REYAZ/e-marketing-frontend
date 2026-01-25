import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const sendEmails = (data) => {
  return API.post("/email/send", data);
};

export const getEmailHistory = async () => {
  const res = await API.get("/email/history");
  return res.data;
};

export const loginAdmin = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const getAdmins = async () => {
  const res = await API.get("/admin");
  return res.data;
};

export const toggleAdminStatus = async (id) => {
  const res = await API.put(`/admin/${id}/status`);
  return res.data;
};

export const getBroadcasts = async () => {
  const res = await API.get("/broadcasts");
  return res.data;
};

export const getBroadcastById = async (id) => {
  const res = await API.get(`/broadcasts/${id}`);
  return res.data;
};


export const createTemplate = async (data) => {
  const res = await API.post("/templates", data);
  return res.data;
};

export const getTemplates = async () => {
  const res = await API.get("/templates");
  return res.data;
};

export const getTemplateById = async (id) => {
  const res = await API.get(`/templates/${id}`);
  return res.data;
};


