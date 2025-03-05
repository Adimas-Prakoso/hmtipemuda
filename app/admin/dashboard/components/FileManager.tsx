/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { FiUpload, FiFolder, FiFile, FiEdit2, FiTrash2, FiDownload } from "react-icons/fi";
import FilePreviewModal from "./FilePreviewModal";

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modified: string;
}

interface ContextMenu {
  x: number;
  y: number;
  file: FileItem;
}

export default function FileManager() {
  const [currentDir, setCurrentDir] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<{src: string; type: "image" | "pdf" | "text" | "markdown"} | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  const loadFiles = async (dir: string) => {
    try {
      const response = await fetch(`/api/files?dir=${encodeURIComponent(dir)}`);
      const data = await response.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Failed to load files:", error);
    }
  };

  useEffect(() => {
    loadFiles(currentDir);
  }, [currentDir]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("action", "upload");
      formData.append("path", currentDir);
      formData.append("file", files[0]);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      loadFiles(currentDir);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file: FileItem) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) return;

    try {
      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("path", file.path);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Delete failed");
      loadFiles(currentDir);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleRename = async (file: FileItem, newName: string) => {
    try {
      const formData = new FormData();
      formData.append("action", "rename");
      formData.append("path", file.path);
      formData.append("newName", newName);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Rename failed");
      loadFiles(currentDir);
    } catch (error) {
      console.error("Rename error:", error);
    }
  };

  const handleExtract = async (file: FileItem) => {
    try {
      const formData = new FormData();
      formData.append("action", "extract");
      formData.append("path", file.path);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Extract failed");
      loadFiles(currentDir);
    } catch (error) {
      console.error("Extract error:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (filename: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return imageExtensions.some((ext) =>
      filename.toLowerCase().endsWith(ext)
    );
  };

  const isPdfFile = (filename: string) => {
    return filename.toLowerCase().endsWith(".pdf");
  };

  const isTextFile = (filename: string) => {
    const textExtensions = [".txt", ".log", ".json", ".xml", ".csv"];
    return textExtensions.some((ext) =>
      filename.toLowerCase().endsWith(ext)
    );
  };

  const isMarkdownFile = (filename: string) => {
    const mdExtensions = [".md", ".markdown"];
    return mdExtensions.some((ext) =>
      filename.toLowerCase().endsWith(ext)
    );
  };

  const isCompressedFile = (filename: string) => {
    const compressedExtensions = [".zip", ".rar", ".7z", ".tar", ".gz"];
    return compressedExtensions.some((ext) =>
      filename.toLowerCase().endsWith(ext)
    );
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file,
    });
  };

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    document.addEventListener("click", closeContextMenu);
    return () => {
      document.removeEventListener("click", closeContextMenu);
    };
  }, [closeContextMenu]);

  const getFileIcon = (file: FileItem) => {
    if (file.isDirectory) {
      return <FiFolder className="h-10 w-10 text-blue-500" />;
    }
    if (isImageFile(file.name)) {
      return (
        <img
          src={`/${file.path}`}
          alt={file.name}
          className="h-24 w-24 rounded object-cover"
        />
      );
    }
    if (isMarkdownFile(file.name)) {
      return <FiFile className="h-10 w-10 text-purple-500" />;
    }
    if (isTextFile(file.name)) {
      return <FiFile className="h-10 w-10 text-green-500" />;
    }
    if (isPdfFile(file.name)) {
      return <FiFile className="h-10 w-10 text-red-500" />;
    }
    return <FiFile className="h-10 w-10 text-gray-500" />;
  };

  const handleFileClick = (file: FileItem) => {
    if (file.isDirectory) {
      setCurrentDir(file.path);
    } else if (isImageFile(file.name)) {
      setPreviewFile({ src: `/${file.path}`, type: "image" });
    } else if (isPdfFile(file.name)) {
      setPreviewFile({ src: `/${file.path}`, type: "pdf" });
    } else if (isMarkdownFile(file.name)) {
      setPreviewFile({ src: `/${file.path}`, type: "markdown" });
    } else if (isTextFile(file.name)) {
      setPreviewFile({ src: `/${file.path}`, type: "text" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="relative rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
            <FiUpload className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload Files
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Drag and drop files here or click to browse
            </p>
          </div>
          <label className="cursor-pointer rounded-lg bg-blue-500 px-6 py-2.5 text-white transition-colors hover:bg-blue-600">
            <span className="flex items-center gap-2">
              <FiUpload className="h-5 w-5" />
              Choose File
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* File Browser */}
      <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800">
        {/* Breadcrumb */}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setCurrentDir("")}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              public
            </button>
            {currentDir.split("/").filter(Boolean).map((dir, index, arr) => (
              <div key={dir + index} className="flex items-center gap-2">
                <span className="text-gray-400 dark:text-gray-500">/</span>
                <button
                  onClick={() => setCurrentDir(arr.slice(0, index + 1).join("/"))}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {dir}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {files.map((file) => (
            <div
              key={file.path}
              onContextMenu={(e) => handleContextMenu(e, file)}
              onClick={() => handleFileClick(file)}
              className="group relative cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
            >
              <div className="flex flex-col items-center gap-2">
                {getFileIcon(file)}
                <span className="mt-2 max-w-full truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {file.isDirectory ? "--" : formatFileSize(file.size)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[160px] rounded-lg bg-white shadow-lg dark:bg-gray-800"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-2">
            <button
              onClick={() => {
                const newName = prompt("Enter new name:", contextMenu.file.name);
                if (newName && newName !== contextMenu.file.name) {
                  handleRename(contextMenu.file, newName);
                }
                closeContextMenu();
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <FiEdit2 className="mr-2 h-4 w-4" />
              Rename
            </button>
            <button
              onClick={() => {
                handleDelete(contextMenu.file);
                closeContextMenu();
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              <FiTrash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
            {isCompressedFile(contextMenu.file.name) && (
              <button
                onClick={() => {
                  handleExtract(contextMenu.file);
                  closeContextMenu();
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FiDownload className="mr-2 h-4 w-4" />
                Extract
              </button>
            )}
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          src={previewFile.src}
          type={previewFile.type}
          alt="Preview"
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}