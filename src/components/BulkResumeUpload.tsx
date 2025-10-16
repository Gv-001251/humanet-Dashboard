import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { ResumeService } from '../services/api/resumeService';

interface BulkResumeUploadProps {
  onUploadComplete?: (successCount: number, failCount: number) => void;
  onClose?: () => void;
}

interface UploadFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  candidateData?: any;
}

export const BulkResumeUpload: React.FC<BulkResumeUploadProps> = ({
  onUploadComplete,
  onClose,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  }, []);

  const handleFileSelect = (newFiles: File[]) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 20;

    const validFiles = newFiles.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        return false;
      }
      if (file.size > maxSize) {
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at once`);
      return;
    }

    const uploadFiles: UploadFile[] = validFiles.map(file => ({
      file,
      status: 'pending',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...uploadFiles]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      setFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      try {
        const uploadRequest = {
          resume: files[i].file,
        };

        const candidate = await ResumeService.uploadResume(uploadRequest);

        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'success', progress: 100, candidateData: candidate } : f
        ));
        successCount++;
      } catch (error) {
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            status: 'error', 
            progress: 0, 
            error: error instanceof Error ? error.message : 'Upload failed' 
          } : f
        ));
        failCount++;
      }
    }

    setIsUploading(false);
    if (onUploadComplete) {
      onUploadComplete(successCount, failCount);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    return <FileText className="w-6 h-6 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 border-green-300';
      case 'error':
        return 'bg-red-100 border-red-300';
      case 'uploading':
        return 'bg-blue-100 border-blue-300';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  const getStatusIcon = (uploadFile: UploadFile) => {
    switch (uploadFile.status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'uploading':
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Bulk Resume Upload</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Drop Zone */}
      {files.length < 20 && !isUploading && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drag and drop resumes here
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse files (up to 20 files)
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            id="bulk-file-upload"
          />
          <label
            htmlFor="bulk-file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Choose Files
          </label>
          <p className="text-xs text-gray-400 mt-2">
            Supports PDF, DOC, DOCX files up to 5MB each
          </p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </span>
            {successCount > 0 || errorCount > 0 ? (
              <span>
                {successCount > 0 && (
                  <span className="text-green-600 mr-2">
                    {successCount} uploaded
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="text-red-600">{errorCount} failed</span>
                )}
              </span>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {files.map((uploadFile, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 border rounded-lg ${getStatusColor(
                  uploadFile.status
                )}`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {getFileIcon(uploadFile.file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                    {uploadFile.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {uploadFile.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(uploadFile)}
                  {uploadFile.status === 'pending' && !isUploading && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex justify-end space-x-3">
          {!isUploading && pendingCount > 0 && (
            <>
              <button
                onClick={() => setFiles([])}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={uploadFiles}
                className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Upload {pendingCount} File{pendingCount !== 1 ? 's' : ''}
              </button>
            </>
          )}
          {isUploading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          )}
          {!isUploading && pendingCount === 0 && files.length > 0 && (
            <button
              onClick={onClose}
              className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Done
            </button>
          )}
        </div>
      )}
    </div>
  );
};
