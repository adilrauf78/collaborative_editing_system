import React, { useEffect, useState } from "react";
import { List, Button, message, Typography, Input, Dropdown, Avatar } from "antd";
import { getUserDocuments } from "../services/documentService";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await getUserDocuments(token);
      if (res.data.success) {
        setDocuments(res.data.documents);
      } else {
        message.error("Failed to fetch documents");
      }
    } catch (error) {
      console.log(error.response ? error.response.data : error);
      message.error("Error fetching documents");
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  // Dropdown menu items
  const menuItems = [
    {
      key: "1",
      label: "Edit Profile",
      onClick: () => navigate("/editprofile"),
    },
    {
      key: "2",
      label: "Change Password",
      onClick: () => navigate("/updatepassword"),
    },
    {
      key: "3",
      label: "Logout",
      onClick: () => {
        localStorage.clear();
        navigate("/login");
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 flex justify-center relative">
      {/* Top-right user avatar */}
      <div className="fixed top-6 right-6">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <span>
            <Avatar
              size={50}
              className="bg-purple-500 cursor-pointer shadow-lg text-white font-bold"
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </span>
        </Dropdown>
      </div>

      <motion.div
        className="bg-white w-full max-w-3xl p-10 rounded-3xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Title
            level={2}
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 font-extrabold"
          >
            Collaborative Editing System
          </Title>
          <Text className="text-gray-500 italic tracking-wider">
            Your VIP workspace for real-time collaboration
          </Text>
        </div>

        {/* Page title & create button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <Title level={3} className="m-0 text-gray-800">
            My Documents
          </Title>
          <Button
            type="primary"
            size="large"
            className="rounded-xl px-6 bg-purple-500 hover:bg-purple-600"
          >
            <Link to="/createdocument" className="text-white">
              Create New
            </Link>
          </Button>
        </div>

        {/* Search bar */}
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 p-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-300 shadow-sm"
        />

        {/* Document list */}
        {filteredDocuments.length === 0 ? (
          <Text type="secondary" className="text-gray-500">
            No documents found.
          </Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={filteredDocuments}
            split
            className="divide-y divide-gray-200"
            renderItem={(item) => (
              <List.Item
                className="py-4 px-4 hover:bg-gray-50 rounded-xl transition-all duration-200 flex justify-between items-center"
              >
                <List.Item.Meta
                  title={
                    <Link
                      to={`/document/${item._id}`}
                      className="text-purple-600 hover:underline font-medium"
                    >
                      {item.title}
                    </Link>
                  }
                  description={`Last updated: ${new Date(
                    item.updatedAt
                  ).toLocaleString()}`}
                />
                <Button
                  type="link"
                  className="text-purple-500 font-semibold"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/document/${item._id}`
                    ) && message.success("Document link copied")
                  }
                >
                  Share
                </Button>
              </List.Item>
            )}
          />
        )}
      </motion.div>
    </div>
  );
};

export default MyDocuments;
