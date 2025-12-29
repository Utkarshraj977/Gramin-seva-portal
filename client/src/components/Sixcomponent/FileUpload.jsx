// src/components/FileUpload.jsx
import React from 'react';
import { UploadCloud } from 'lucide-react';

const FileUpload = ({ label, name, onChange, required }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-emerald-50 hover:border-emerald-400 transition-all group">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-emerald-600 mb-2" />
          <p className="text-xs text-gray-500 group-hover:text-emerald-700">
            Click to upload
          </p>
        </div>
        <input 
          type="file" 
          name={name}
          onChange={onChange}
          className="hidden" // Hides the ugly default input
        />
      </label>
    </div>
  );
};

export default FileUpload;