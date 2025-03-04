/* eslint-disable @next/next/no-img-element */
"use client";

interface ImagePreviewModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImagePreviewModal({
  src,
  alt,
  onClose,
}: ImagePreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white p-2 shadow-xl">
        <img
          src={src}
          alt={alt}
          className="h-auto max-h-[85vh] w-auto max-w-[85vw] object-contain"
        />
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