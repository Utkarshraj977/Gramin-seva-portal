import React, { useState, useEffect } from "react";
import { Upload, File, Download, Trash2, CheckCircle, Clock, X } from "lucide-react";
import toast from "react-hot-toast";
import { documents } from "../services/api";

const DocumentUpload = ({ roomId, currentUserId, targetUserId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const res = await documents.getRoomDocuments(roomId);
      setAllDocuments(res.data || []);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchDocuments();
      const interval = setInterval(fetchDocuments, 5000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("roomId", roomId);
    formData.append("uploadedForId", targetUserId);
    formData.append("description", description);

    try {
      setUploading(true);
      await documents.upload(formData);
      toast.success("Document uploaded successfully");
      setSelectedFile(null);
      setDescription("");
      fetchDocuments();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await documents.delete(docId);
      toast.success("Document deleted");
      fetchDocuments();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleDownload = async (docId, url) => {
    try {
      await documents.updateStatus(docId, "downloaded");
      window.open(url, "_blank");
      fetchDocuments();
    } catch (error) {
      console.error("Status update failed", error);
      window.open(url, "_blank");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Upload size={20} className="text-blue-600" />
        Document Exchange
      </h3>

      {/* Upload Section */}
      <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="doc-upload"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
        />
        <label
          htmlFor="doc-upload"
          className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:bg-slate-50 transition-all"
        >
          <File size={20} className="text-slate-600" />
          <span className="text-sm text-slate-600">
            {selectedFile ? selectedFile.name : "Click to select file (Max 10MB)"}
          </span>
        </label>

        {selectedFile && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Add description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setDescription("");
                }}
                className="px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-700">Shared Documents</h4>
        {loading ? (
          <p className="text-center text-slate-400 py-4">Loading...</p>
        ) : allDocuments.length === 0 ? (
          <p className="text-center text-slate-400 py-4">No documents shared yet</p>
        ) : (
          allDocuments.map((doc) => {
            const isMyUpload = String(doc.uploadedBy._id) === String(currentUserId);
            return (
              <div
                key={doc._id}
                className={`p-4 rounded-xl border ${
                  isMyUpload ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <File size={16} className="text-slate-600" />
                      <p className="font-bold text-sm text-slate-800">{doc.fileName}</p>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">
                      {isMyUpload ? "You" : doc.uploadedBy.username} • {formatFileSize(doc.fileSize)} • {formatDate(doc.createdAt)}
                    </p>
                    {doc.description && (
                      <p className="text-xs text-slate-600 italic mt-1">"{doc.description}"</p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      {doc.status === 'downloaded' || doc.status === 'completed' ? (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle size={12} /> Viewed
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(doc._id, doc.fileUrl)}
                      className="p-2 bg-white rounded-lg hover:bg-slate-100 border border-slate-200"
                      title="Download"
                    >
                      <Download size={16} className="text-blue-600" />
                    </button>
                    {isMyUpload && (
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="p-2 bg-white rounded-lg hover:bg-red-50 border border-slate-200"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
