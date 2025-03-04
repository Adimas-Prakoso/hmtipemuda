"use client";

import { useState, useEffect } from "react";
import { FiUpload, FiFolder, FiFile, FiEdit2, FiTrash2 } from "react-icons/fi";
import ImagePreviewModal from "./ImagePreviewModal";

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modified: string;
}

export default function FileManager() {
  const [currentDir, setCurrentDir] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const getFileIcon = (file: FileItem) => {
    if (file.isDirectory) {
      return <FiFolder className="h-5 w-5 text-blue-500" />;
    }
    if (isImageFile(file.name)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/${file.path}`}
          alt={file.name}
          className="h-8 w-8 rounded object-cover"
        />
      );
    }
    return <FiFile className="h-5 w-5 text-gray-500" />;
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

        {/* File List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Size
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Modified
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-transparent">
              {files.map((file) => (
                <tr
                  key={file.path}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file)}
                      <button
                        onClick={() => {
                          if (file.isDirectory) {
                            setCurrentDir(file.path);
                          } else if (isImageFile(file.name)) {
                            setPreviewImage(`/${file.path}`);
                          }
                        }}
                        className={`${
                          file.isDirectory || isImageFile(file.name)
                            ? "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {file.name}
                      </button>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {file.isDirectory ? "--" : formatFileSize(file.size)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(file.modified).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => {
                          const newName = prompt(
                            "Enter new name:",
                            file.name
                          );
                          if (newName && newName !== file.name) {
                            handleRename(file, newName);
                          }
                        }}
                        className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                        title="Rename"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          src={previewImage}
          alt="Preview"
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}