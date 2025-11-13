import React, { useState } from 'react';
import { Upload, FileText, Check, X, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const Existingcv = ({ onBack }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    const allowedTypes = ['application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF document');
      return;
    }

    if (selectedFile.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('govCV', file);

      const response = await api.post('/cv/upload-gov-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadSuccess(true);
        toast.success('CV uploaded successfully!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload CV';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadSuccess(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#04445E] mb-2">Upload Your Existing CV</h1>
            <p className="text-gray-600">
              Upload your current CV and we'll help you enhance it for USMLE applications
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors ${
              dragActive 
                ? 'border-[#169AB4] bg-blue-50' 
                : 'border-gray-300 hover:border-[#169AB4]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <FileText className="h-8 w-8 text-[#169AB4]" />
                  <div className="text-left">
                    <p className="font-semibold text-[#04445E]">{file.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {uploadSuccess && (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span>Upload successful!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag and drop your CV here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
                <label className="inline-block cursor-pointer bg-[#169AB4] text-white px-6 py-2 rounded-lg hover:bg-[#147a8f] transition-colors">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
            )}
          </div>

          {file && !uploadSuccess && (
            <div className="text-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-[#04445E] text-white px-8 py-3 rounded-lg hover:bg-[#033a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </span>
                ) : (
                  'Upload CV'
                )}
              </button>
            </div>
          )}

          {uploadSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">CV Uploaded Successfully!</h3>
              <p className="text-green-700 mb-4">
                Your CV has been uploaded and saved. You can now view and edit it in the CV Builder.
              </p>
              <button
                onClick={onBack}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to CV Builder
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Existingcv;