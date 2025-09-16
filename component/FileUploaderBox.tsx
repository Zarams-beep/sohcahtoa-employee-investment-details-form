"use client";

import { useState, useRef, useCallback } from "react";
import { BsCloudArrowUpFill } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";

interface FileUploaderProps {
  id?: string;
  onFileSelect: (file: File | null, base64?: string | null) => void; // send both File and base64
  hasError: boolean;
}
export default function FileUploaderBox({
  id,
  onFileSelect,
  hasError,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate file size/type here
  const validateFile = (file: File) => {
    const maxSizeMB = 5;
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    
    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type!");
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB} MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      onFileSelect(file, base64); // send both File and base64
    };
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onFileSelect(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatFileSize = (size: number) =>
    (size / (1024 * 1024)).toFixed(2) + " MB";

  return (
    <div className={`main-img-props-container ${selectedFile ? "file-selected" : ""}`}>
      <div className="img-props-container">
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
          className="input-image-props"
          onChange={handleChange}
        />
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`file-container ${dragOver ? "drag-over" : ""} ${hasError ? "error-style" : ""}`}
        >
          <BsCloudArrowUpFill className="cloud-icon" />
          <p className="browse-file">Browse Files</p>
          <p className="sub-cloud">Drag and drop files here</p>
        </div>
      </div>

      {selectedFile && (
        <div className="display-file-wrapper">
          <p className="display-file">
            <span>{selectedFile.name}</span>
            <span>({formatFileSize(selectedFile.size)})</span>
          </p>
          <FiTrash2 className="delete-icon" onClick={handleRemove} title="Remove file" />
        </div>
      )}
    </div>
  );
}
