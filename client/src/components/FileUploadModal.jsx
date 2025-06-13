import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import { X, Upload, AlertCircle } from "lucide-react";
import { addTodoAttachment } from "../store/todosSlice";
import { cn, formatFileSize, getFileIcon } from "../utils/cn";
import PropTypes from "prop-types";

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
    if (!selectedFiles.length) return;

    // Ensure todo exists and has an ID
    if (!todo || !todo._id) {
      console.error("No todo selected for file upload");
      return;
    }

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/95 to-gray-900/95 p-8 text-left align-middle shadow-2xl backdrop-blur-sm transition-all">
                <div className="mb-6 flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-white"
                  >
                    Upload Attachment
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="rounded-full p-1 text-gray-400 transition-all duration-200 hover:bg-gray-700/50 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>{" "}
                {todo && todo.content && (
                  <div className="mb-4 rounded-2xl border border-gray-600/30 bg-gradient-to-r from-gray-700/70 to-gray-800/70 p-4 backdrop-blur-sm">
                    <p className="text-sm text-gray-300">
                      Adding attachment to:{" "}
                      <span className="font-medium text-white">
                        {todo.content}
                      </span>
                    </p>
                  </div>
                )}
                {!todo && (
                  <div className="mb-4 rounded-2xl border border-red-600/30 bg-red-900/20 p-4">
                    <p className="text-sm text-red-400">
                      Error: No todo selected. Please close this dialog and try
                      again.
                    </p>
                  </div>
                )}
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={cn(
                      "cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
                      isDragActive
                        ? "border-blue-400/70 bg-blue-400/10 backdrop-blur-sm"
                        : selectedFiles.length
                          ? "border-green-400/70 bg-green-400/10 backdrop-blur-sm"
                          : "border-gray-600/70 hover:border-gray-500/70 hover:bg-gray-700/20"
                    )}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    {isDragActive ? (
                      <p className="text-blue-400">Drop the file here...</p>
                    ) : (
                      <>
                        <p className="mb-2 text-gray-300">
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
                          className="flex items-center justify-between rounded-2xl bg-gray-700 p-3"
                        >
                          <div className="flex min-w-0 flex-1 items-center space-x-3">
                            <span className="text-2xl">
                              {getFileIcon(file.type)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-white">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={removeFile}
                            className="text-red-400 transition-colors hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="rounded-2xl border border-blue-800 bg-blue-900/20 p-3">
                    <div className="flex">
                      <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 text-blue-400" />
                      <div className="text-sm text-blue-300">
                        <p className="mb-1 font-medium">
                          Supported file types:
                        </p>
                        <ul className="space-y-1 text-xs">
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
                      className="px-4 py-2 text-gray-300 transition-colors hover:text-white disabled:opacity-50"
                    >
                      Cancel
                    </button>{" "}
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFiles.length || uploading || !todo}
                      className="rounded-2xl bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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

FileUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  todo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }),
};

export default FileUploadModal;
