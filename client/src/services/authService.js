import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth";

// LOGIN
export const loginUser = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, { email, password });
    if (data.success) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("userName", data.user.userName); // for avatar
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// SIGNUP
export const signupUser = async (userName, email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/signup`, { userName, email, password });
    return data;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

// GET USER PROFILE
export const getUser = async (token) => {
  try {
    const { data } = await axios.post(`${API_URL}/editProfile`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// UPDATE USER PROFILE
export const updateUser = async (updates, token) => {
  try {
    const { data } = await axios.post(`${API_URL}/editProfile`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data.success && updates.userName) localStorage.setItem("userName", updates.userName);
    return data;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

// UPDATE PASSWORD
export const updatePassword = async (oldPassword, newPassword, token) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/updatePassword`,
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
