import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Form, Input, Button, message } from "antd";
import { LogIn, User } from "lucide-react";
import { loginUser } from "../services/authService";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    const result = await loginUser(values.email, values.password);

    if (result) {
      message.success("Login successful");
      navigate("/mydocuments");
    } else {
      message.error("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-100">
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <User className="text-purple-500" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-500 mt-2">
            Enter your email and password to continue
          </p>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label={<span className="text-gray-700">Email</span>}
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input
              size="large"
              placeholder="Enter your email"
              className="rounded-xl p-3 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-300"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-gray-700">Password</span>}
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              size="large"
              placeholder="Enter your password"
              className="rounded-xl p-3 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-300"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            icon={<LogIn size={18} />}
            className="w-full mt-4 py-3 text-lg font-semibold rounded-xl bg-purple-500 hover:bg-purple-600 shadow-md"
          >
            Login
          </Button>
        </Form>

        <p className="text-center mt-6 text-gray-500">
          Don't have an account?
          <Link
            to="/signup"
            className="text-purple-500 ml-1 hover:underline font-medium"
          >
            Signup
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
