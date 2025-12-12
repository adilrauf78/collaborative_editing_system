import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { getUser, updateUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      if (!token) return navigate("/login");

      const res = await getUser(token);
      if (res && res.success && res.user) {
        form.setFieldsValue({
          userName: res.user.userName,
          email: res.user.email,
        });
      } else {
        message.error("Failed to load user data");
      }
    };
    loadUser();
  }, [form, token, navigate]);

  const handleUpdate = async (values) => {
    setLoading(true);

    const res = await updateUser({ userName: values.userName, email: values.email }, token);

    if (res.success) {
      message.success("Profile updated successfully");
      localStorage.setItem("userName", values.userName); // Update avatar name
      navigate("/mydocuments");
    } else {
      message.error(res.message || "Failed to update profile");
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item
          name="userName"
          label="Full Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} className="w-full mt-4">
          Update Profile
        </Button>
      </Form>
    </Card>
  );
};

export default EditProfilePage;
