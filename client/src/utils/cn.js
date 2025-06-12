import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (mimetype) => {
  if (mimetype.startsWith("image/")) return "🖼️";
  if (mimetype.includes("pdf")) return "📄";
  if (mimetype.includes("word")) return "📝";
  if (mimetype.includes("excel") || mimetype.includes("spreadsheet"))
    return "📊";
  if (mimetype.includes("powerpoint") || mimetype.includes("presentation"))
    return "📺";
  if (mimetype.includes("zip") || mimetype.includes("rar")) return "🗜️";
  return "📎";
};
