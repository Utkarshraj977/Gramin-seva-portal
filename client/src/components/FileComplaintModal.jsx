import React, { useState } from "react";
import { X, Upload, Loader2, FileText, MapPin, Image } from "lucide-react";
import toast from "react-hot-toast";
import { complaintUser } from "../services/api";

const FileComplaintModal = ({ isOpen, onClose, admin, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    message: "",
    location: "",
    complaintImage: null
  });

  const categories = ["Electricity", "Water", "Roads", "Sanitation", "Health", "Education", "Other"];

  if (!isOpen || !admin) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData({ ...formData, complaintImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message || !formData.location) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("message", formData.message);
    data.append("location", formData.location);
    if (formData.complaintImage) {
      data.append("complaintImage", formData.complaintImage);
    }

    try {
      setLoading(true);
      await complaintUser.file_complaint(admin._id, data);
      toast.success("Complaint filed successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to file complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 flex items-center justify-between bg-slate-800/50 border-b border-slate-700">
          <div>
            <h3 className="text-lg font-bold text-white">File Complaint</h3>
            <p className="text-xs text-slate-400 mt-1">To: {admin.userInfo?.fullName} - {admin.designation}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              <FileText size={16} className="inline mr-2" />
              Complaint Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Street Light Not Working"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Location / Ward *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Ward No. 5, Main Road"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Detailed Description *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Explain your issue in detail..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500 resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              <Image size={16} className="inline mr-2" />
              Evidence Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="complaint-image-modal"
            />
            <label
              htmlFor="complaint-image-modal"
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-red-500 transition-colors"
            >
              <Upload size={20} className="text-slate-500" />
              <span className="text-slate-500 text-sm">
                {formData.complaintImage ? formData.complaintImage.name : "Click to upload image"}
              </span>
            </label>
            {imagePreview && (
              <div className="mt-3 h-32 rounded-xl overflow-hidden border border-slate-800">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

        </form>

        {/* Footer */}
        <div className="p-5 bg-slate-950/50 border-t border-slate-800 flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Complaint"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default FileComplaintModal;