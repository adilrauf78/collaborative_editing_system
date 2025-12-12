import React, { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { updatePassword } from "../services/authService";
import { useNavigate } from "react-router-dom";

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (values) => {
    setLoading(true);

    if (values.newPassword !== values.confirmPassword) {
      message.error("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    // Call updatePassword with the latest authService signature
    const res = await updatePassword(values.oldPassword, values.newPassword, token);

    if (res.success) {
      message.success("Password updated successfully");
      form.resetFields();
      navigate("/mydocuments");
    } else {
      message.error(res.message || "Failed to update password");
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item
          name="oldPassword"
          label="Old Password"
          rules={[{ required: true, message: "Please enter your old password" }]}
        >
          <Input.Password placeholder="Old password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, message: "Please enter new password" }]}
        >
          <Input.Password placeholder="New password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[{ required: true, message: "Please confirm new password" }]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} className="w-full mt-4">
          Update Password
        </Button>
      </Form>
    </Card>
  );
};

export default UpdatePasswordPage;
