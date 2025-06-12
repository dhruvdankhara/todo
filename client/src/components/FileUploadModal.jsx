import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import { X, Upload, AlertCircle } from "lucide-react";
import { addTodoAttachment } from "../store/todosSlice";
import { cn, formatFileSize, getFileIcon } from "../utils/cn";

const FileUploadModal = ({ isOpen, onClose, todo }) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
      "application/zip": [".zip"],
      "application/x-rar-compressed": [".rar"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFiles.length || !todo) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("attachment", selectedFiles[0]);

      await dispatch(addTodoAttachment({ id: todo._id, formData })).unwrap();
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFiles([]);
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-white"
                  >
                    Upload Attachment
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {todo && (
                  <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300">
                      Adding attachment to:{" "}
                      <span className="text-white font-medium">
                        {todo.content}
                      </span>
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                      isDragActive
                        ? "border-blue-400 bg-blue-400/10"
                        : selectedFiles.length
                        ? "border-green-400 bg-green-400/10"
                        : "border-gray-600 hover:border-gray-500"
                    )}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    {isDragActive ? (
                      <p className="text-blue-400">Drop the file here...</p>
                    ) : (
                      <>
                        <p className="text-gray-300 mb-2">
                          Drag & drop a file here, or click to select
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports images, documents, text files, and archives
                          (max 10MB)
                        </p>
                      </>
                    )}
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">
                        Selected File:
                      </h4>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <span className="text-2xl">
                              {getFileIcon(file.type)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-white truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={removeFile}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                      <div className="text-sm text-blue-300">
                        <p className="font-medium mb-1">
                          Supported file types:
                        </p>
                        <ul className="text-xs space-y-1">
                          <li>• Images: PNG, JPG, JPEG, GIF, WebP</li>
                          <li>
                            • Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
                          </li>
                          <li>• Text: TXT, CSV</li>
                          <li>• Archives: ZIP, RAR</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={uploading}
                      className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFiles.length || uploading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "Upload File"}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FileUploadModal;
