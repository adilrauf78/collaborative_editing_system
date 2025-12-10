import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth";

// LOGIN
export const loginUser = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    if (data.success) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("userId", data.user._id);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// SIGNUP
export const signupUser = async (userName, email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/signup`, {
      userName,
      email,
      password,
    });

    return data;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
