import React, { useCallback, useState } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';

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
      className={`w-full p-4 rounded-md border ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300 bg-white'}`}
    >
      {!selectedFile ? (
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-gray-100">
            <Upload className="w-6 h-6 text-gray-700" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Drag & drop your resume</label>
            <p className="text-xs text-gray-500">PDF, DOCX, or TXT — we’ll analyze and suggest roles & training.</p>
            <div className="mt-2">
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onInputChange}
                className="sr-only"
              />
              <label htmlFor="file-upload" className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded text-sm cursor-pointer">
                Select file
              </label>
            </div>
            {loading && (
              <div className="mt-2 text-sm text-gray-600 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" /> Analyzing your resume...
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-gray-100">
              <FileIcon className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <div className="text-sm font-medium">{selectedFile.name}</div>
              <div className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={clearFile} className="p-2 rounded-full hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
