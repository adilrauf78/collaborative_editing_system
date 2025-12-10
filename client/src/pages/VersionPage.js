import React, { useEffect, useState } from "react";
import { Table, Button, Input, message, Typography, Card } from "antd";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import {
  getVersions,
  addVersion,
  revertVersion,
  getDocumentContent,
} from "../services/versionService";
import { motion } from "framer-motion";

const { Title } = Typography;
const socket = io("http://localhost:8080");

const VersionPage = () => {
  const { id } = useParams();
  const documentId = id;

  const [versions, setVersions] = useState([]);
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const loadContent = async () => {
    try {
      const latestContent = await getDocumentContent(documentId);
      setContent(latestContent);
    } catch (err) {
      console.error(err);
      message.error("Error loading document content");
    }
  };

  const loadVersions = async () => {
    try {
      const res = await getVersions(documentId);
      if (res.success) setVersions(res.versions);
    } catch (err) {
      console.error(err);
      message.error("Error fetching versions");
    }
  };

  useEffect(() => {
    loadContent();
    loadVersions();

    socket.emit("join-document", documentId);

    socket.on("receive-changes", (newContent) => {
      setContent(newContent);
    });

    socket.on("versionUpdated", (data) => {
      if (data.documentId === documentId) {
        loadVersions();
        loadContent();
      }
    });

    return () => {
      socket.off("receive-changes");
      socket.off("versionUpdated");
    };
  }, [documentId]);

  const handleAddVersion = async () => {
    if (!content) return message.error("Content is required");
    setLoading(true);
    try {
      const res = await addVersion(documentId, content, notes);
      if (res.success) {
        message.success("Version added successfully");
        setNotes("");
        socket.emit("send-changes", { documentId, content });
        loadVersions();
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Error adding version");
    }
    setLoading(false);
  };

  const handleRevert = async (versionId) => {
    setLoading(true);
    try {
      const res = await revertVersion(versionId);
      if (res.success) {
        message.success("Document reverted to selected version");
        loadContent();
        loadVersions();
        socket.emit("send-changes", { documentId, content });
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Error reverting version");
    }
    setLoading(false);
  };

  const columns = [
    { title: "Version", dataIndex: "versionNumber", key: "versionNumber" },
    { title: "Edited By", dataIndex: ["editedBy", "userName"], key: "editedBy" },
    { title: "Notes", dataIndex: "notes", key: "notes" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          className="rounded-lg bg-purple-500 hover:bg-purple-600"
          onClick={() => handleRevert(record._id)}
        >
          Revert
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 flex justify-center">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="rounded-3xl shadow-2xl p-10 bg-white">
          <Title level={3} className="mb-6">
            Document Versions
          </Title>

          <Input.TextArea
            rows={5}
            placeholder="Edit content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-4 p-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-300 shadow-sm"
          />

          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4 p-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-300 shadow-sm"
          />

          <Button
            type="primary"
            loading={loading}
            onClick={handleAddVersion}
            className="mb-6 w-full py-3 text-lg font-semibold rounded-xl bg-purple-500 hover:bg-purple-600 shadow-md"
          >
            Add Version
          </Button>

          <Table
            columns={columns}
            dataSource={versions}
            rowKey="_id"
            className="rounded-xl overflow-hidden"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default VersionPage;
