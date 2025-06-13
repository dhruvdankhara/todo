import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { X, Link as LinkIcon, AlertCircle } from "lucide-react";
import { addTodoLink } from "../store/todosSlice";
import { cn } from "../utils/cn";

const LinkModal = ({ isOpen, onClose, todo }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const linkData = {
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
      };

      await dispatch(addTodoLink({ id: todo._id, linkData })).unwrap();

      setFormData({
        title: "",
        url: "",
        description: "",
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error adding link:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      url: "",
      description: "",
    });
    setErrors({});
    onClose();
  };

  const handleUrlBlur = () => {
    if (formData.url && !formData.title) {
      try {
        const url = new URL(formData.url);
        const hostname = url.hostname.replace("www.", "");
        setFormData((prev) => ({
          ...prev,
          title: hostname,
        }));
      } catch {
        // Invalid URL, ignore
      }
    }
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="mb-6 flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-white"
                  >
                    Add Link
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {todo && (
                  <div className="mb-4 rounded-lg bg-gray-700 p-3">
                    <p className="text-sm text-gray-300">
                      Adding link to:{" "}
                      <span className="font-medium text-white">
                        {todo.content}
                      </span>
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="url"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      <LinkIcon className="mr-1 inline h-4 w-4" />
                      URL *
                    </label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      onBlur={handleUrlBlur}
                      placeholder="https://example.com"
                      className={cn(
                        "w-full rounded-lg border bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500",
                        errors.url ? "border-red-500" : "border-gray-600"
                      )}
                    />
                    {errors.url && (
                      <div className="mt-1 flex items-center text-sm text-red-400">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors.url}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Link title (optional)"
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      If left empty, the domain name will be used
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="What is this link about? (optional)"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {formData.url && !errors.url && (
                    <div className="rounded-lg border border-blue-800 bg-blue-900/20 p-3">
                      <div className="flex items-start">
                        <LinkIcon className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-blue-300">
                            {formData.title || "Link Preview"}
                          </p>
                          <p className="break-all text-xs text-blue-400">
                            {formData.url}
                          </p>
                          {formData.description && (
                            <p className="mt-1 text-xs text-gray-400">
                              {formData.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-gray-300 transition-colors hover:text-white disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.url.trim()}
                      className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? "Adding..." : "Add Link"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LinkModal;
