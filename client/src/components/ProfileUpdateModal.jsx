import React, { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ProfileUpdateModal = ({ isOpen, onClose, currentProfile, onUpdate, isAdmin }) => {
  const [formData, setFormData] = useState({
    Start_time: currentProfile?.Start_time || "",
    End_time: currentProfile?.End_time || "",
    location: currentProfile?.location || "",
    Experience: currentProfile?.Experience || "",
    message: currentProfile?.message || "",
  });
  const [shopPic, setShopPic] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setShopPic(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAdmin) {
        const formDataToSend = new FormData();
        if (formData.Start_time) formDataToSend.append("Start_time", formData.Start_time);
        if (formData.End_time) formDataToSend.append("End_time", formData.End_time);
        if (formData.location) formDataToSend.append("location", formData.location);
        if (formData.Experience) formDataToSend.append("Experience", formData.Experience);
        if (shopPic) formDataToSend.append("cyber_shopPic", shopPic);

        await onUpdate(formDataToSend);
      } else {
        // User update
        const updateData = {};
        if (formData.Start_time) updateData.Start_time = formData.Start_time;
        if (formData.End_time) updateData.End_time = formData.End_time;
        if (formData.location) updateData.location = formData.location;
        if (formData.message) updateData.message = formData.message;

        await onUpdate(updateData);
      }
      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-800">Update Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              name="Start_time"
              value={formData.Start_time}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              name="End_time"
              value={formData.End_time}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {isAdmin ? (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  name="Experience"
                  value={formData.Experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Shop Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {shopPic && (
                  <p className="text-xs text-slate-500 mt-1">{shopPic.name}</p>
                )}
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Message/Requirements
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your requirements or message"
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;