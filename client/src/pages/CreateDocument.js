import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { createDocument } from "../services/documentService";
import { motion } from "framer-motion";
import { Edit3 } from "lucide-react";

const CreateDocument = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title) return message.error("Title is required");
    setLoading(true);
    try {
      const res = await createDocument(form, token);
      if (res.data.success) {
        message.success("Document created!");
        navigate(`/document/${res.data.document._id}`);
      }
    } catch (error) {
      console.log(error);
      message.error("Error creating document");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <motion.div
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Edit3 size={50} className="mx-auto text-purple-500" />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            New Document
          </h1>
          <p className="text-gray-500 mt-2">
            Enter the title and content to start your document
          </p>
        </div>

        <Input
          size="large"
          placeholder="Document Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mb-6 p-4 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
        />

        <Input.TextArea
          rows={12}
          placeholder="Write your content..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="mb-6 p-4 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
        />

        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={handleSubmit}
          className="w-full py-3 text-lg font-semibold bg-purple-500 hover:bg-purple-600 rounded-lg shadow-md"
        >
          Create Document
        </Button>
      </motion.div>
    </div>
  );
};

export default CreateDocument;
