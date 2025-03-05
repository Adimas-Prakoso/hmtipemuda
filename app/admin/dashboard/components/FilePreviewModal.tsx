/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface FilePreviewModalProps {
  src: string;
  type: "image" | "pdf" | "text" | "markdown";
  alt: string;
  onClose: () => void;
}

export default function FilePreviewModal({
  src,
  type,
  alt,
  onClose,
}: FilePreviewModalProps) {
  const [textContent, setTextContent] = useState<string>("");

  useEffect(() => {
    if (type === "text" || type === "markdown") {
      fetch(src)
        .then((response) => response.text())
        .then(setTextContent)
        .catch(console.error);
    }
  }, [src, type]);

  const renderContent = () => {
    switch (type) {
      case "image":
        return (
          <img
            src={src}
            alt={alt}
            className="h-auto max-h-[85vh] w-auto max-w-[85vw] object-contain"
          />
        );
      case "pdf":
        return (
          <iframe
            src={`${src}#toolbar=0`}
            className="h-[85vh] w-[85vw]"
            title={alt}
          />
        );
      case "markdown":
        return (
          <div className="markdown-preview h-[85vh] w-[85vw] overflow-auto bg-white p-6 dark:bg-gray-800">
            <ReactMarkdown>{textContent}</ReactMarkdown>
          </div>
        );
      case "text":
        return (
          <div className="h-[85vh] w-[85vw] overflow-auto bg-white p-6 dark:bg-gray-800">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">
              {textContent}
            </pre>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white p-2 shadow-xl dark:bg-gray-800">
        {renderContent()}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}