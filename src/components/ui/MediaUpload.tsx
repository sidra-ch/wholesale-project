"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Film, ImageIcon, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";

type UploadResult = {
  url: string;
  public_id: string;
  type: "image" | "video";
};

type MediaUploadProps = {
  onUpload: (result: UploadResult) => void;
  accept?: "image" | "video" | "both";
  folder?: string;
  maxSizeMB?: number;
  className?: string;
  label?: string;
  preview?: string | null;
};

export function MediaUpload({
  onUpload,
  accept = "image",
  folder = "products",
  maxSizeMB = 10,
  className = "",
  label,
  preview: initialPreview = null,
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const [previewType, setPreviewType] = useState<"image" | "video">("image");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptStr =
    accept === "video"
      ? "video/mp4,video/webm,video/ogg,video/quicktime"
      : accept === "both"
        ? "image/jpeg,image/png,image/jpg,image/gif,image/webp,video/mp4,video/webm,video/ogg"
        : "image/jpeg,image/png,image/jpg,image/gif,image/webp";

  const maxSizeBytes = (accept === "video" ? 100 : maxSizeMB) * 1024 * 1024;

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploaded(false);

      if (file.size > maxSizeBytes) {
        setError(`File too large. Max ${accept === "video" ? 100 : maxSizeMB}MB.`);
        return;
      }

      // Preview
      const isVideo = file.type.startsWith("video/");
      setPreviewType(isVideo ? "video" : "image");
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        const endpoint = isVideo ? "/upload/video" : "/upload/image";
        const res = await api.post<UploadResult>(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) {
              setProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
        });

        setUploaded(true);
        onUpload(res.data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Upload failed. Try again.";
        setError(msg);
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [accept, folder, maxSizeBytes, maxSizeMB, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearPreview = () => {
    setPreview(null);
    setUploaded(false);
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragging ? "border-candy bg-candy/5 scale-[1.02]" : "border-gray-200 hover:border-candy/50 bg-gray-50 hover:bg-gray-50/80"}
          ${preview ? "aspect-video" : "p-8"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptStr}
          onChange={handleInputChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full min-h-[200px]"
            >
              {previewType === "video" ? (
                <video
                  src={preview}
                  className="w-full h-full object-cover rounded-xl"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-xl"
                  unoptimized
                />
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 rounded-xl">
                {!uploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearPreview();
                    }}
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </button>
                )}
              </div>

              {/* Upload progress */}
              {uploading && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3 rounded-b-xl">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                    <div className="flex-1">
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-candy to-red-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-white font-medium">
                      {progress}%
                    </span>
                  </div>
                </div>
              )}

              {/* Uploaded badge */}
              {uploaded && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg"
                >
                  <CheckCircle className="h-4 w-4" />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={isDragging ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                className="w-14 h-14 bg-candy/10 rounded-2xl flex items-center justify-center mb-4"
              >
                {accept === "video" ? (
                  <Film className="h-6 w-6 text-candy" />
                ) : accept === "both" ? (
                  <Upload className="h-6 w-6 text-candy" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-candy" />
                )}
              </motion.div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {isDragging ? "Drop here!" : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs text-gray-400">
                {accept === "video"
                  ? "MP4, WebM, MOV up to 100MB"
                  : accept === "both"
                    ? "Images or videos"
                    : "JPEG, PNG, WebP up to 10MB"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-500 mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
