import React, { useCallback, useState } from 'react';
import { Upload, File as FileIcon, X, Sparkles, Zap } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
}

export function FileUpload({ onFileSelect, loading = false }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    onFileSelect(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full p-8 rounded-2xl border-2 border-dashed transition-all duration-300 ${
        dragActive 
          ? 'border-purple-400 bg-purple-500/10 scale-105' 
          : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50'
      }`}
    >
      {!selectedFile ? (
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-10 h-10 text-white" />
            </div>
            {dragActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">
            {dragActive ? 'Drop your resume here!' : 'Upload Your Resume'}
          </h3>
          <p className="text-gray-300 mb-6">
            Drag & drop your resume or click to browse
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Supports PDF, DOCX, and TXT files
          </p>
          
          <div className="space-y-4">
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={onInputChange}
              className="sr-only"
            />
            <label 
              htmlFor="file-upload" 
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5" />
              <span>Choose File</span>
            </label>
          </div>

          {loading && (
            <div className="mt-8">
              <div className="flex items-center justify-center space-x-3 text-white mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                <span className="text-lg font-medium">AI is analyzing your resume...</span>
              </div>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <FileIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white">{selectedFile.name}</div>
              <div className="text-sm text-gray-300">{(selectedFile.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
          <button 
            onClick={clearFile} 
            className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
        </div>
      )}
    </div>
  );
}