// src/pages/DocumentEditor.js
import React, { useEffect, useState } from "react";
import { Input, Button, message, Alert, Typography } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, updateDocument } from "../services/documentService";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

const { Title } = Typography;
const socket = io("http://localhost:8080"); // backend URL

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveUpdate, setLiveUpdate] = useState(false);

  useEffect(() => {
    const loadDoc = async () => {
      try {
        const res = await getDocument(id, token);
        if (res.data.success) setDoc(res.data.document);
      } catch (error) {
        console.error(error);
        message.error("Error loading document");
      }
    };
    loadDoc();

    socket.emit("join-document", id);

    socket.on("receive-changes", (newContent) => {
      setDoc((prev) => ({ ...prev, content: newContent }));
      setLiveUpdate(true);
      setTimeout(() => setLiveUpdate(false), 2000);
    });

    return () => socket.off("receive-changes");
  }, [id, token]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setDoc((prev) => ({ ...prev, content: newContent }));
    socket.emit("send-changes", { documentId: id, content: newContent });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateDocument(
        id,
        { title: doc.title, content: doc.content },
        token
      );
      if (res.data.success) message.success("Document saved!");
    } catch (err) {
      console.error(err);
      message.error("Error saving document");
    }
    setLoading(false);
  };

  if (!doc)
    return (
      <h2 className="text-center mt-20 text-gray-600 text-xl">
        Loading Document...
      </h2>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <Title level={3}>Edit Document</Title>
          <p className="text-gray-500 mt-1">
            Modify your document below. Changes are synced in real-time.
          </p>
        </div>

        {liveUpdate && (
          <Alert
            message="Document updated by another user"
            type="info"
            showIcon
            closable
            className="mb-6"
          />
        )}

        <Input
          size="large"
          placeholder="Document Title"
          value={doc.title}
          onChange={(e) => setDoc({ ...doc, title: e.target.value })}
          className="mb-6 p-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-300"
        />

        <Input.TextArea
          rows={12}
          placeholder="Write your content..."
          value={doc.content}
          onChange={handleContentChange}
          className="mb-6 p-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-300"
        />

        <motion.div className="flex flex-wrap gap-4" whileHover={{ scale: 1 }}>
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleUpdate}
            className="flex-1 py-3 text-lg font-semibold bg-purple-500 hover:bg-purple-600 rounded-xl shadow-lg transition-all duration-300"
          >
            Save Changes
          </Button>

          <Button
            type="default"
            size="large"
            onClick={() => navigate(`/document/${id}/versions`)}
            className="flex-1 py-3 text-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            View Versions
          </Button>

          <Button
            type="dashed"
            size="large"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/document/${doc._id}`
              );
              message.success("Document link copied to clipboard");
            }}
            className="flex-1 py-3 text-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            Share
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DocumentEditor;
