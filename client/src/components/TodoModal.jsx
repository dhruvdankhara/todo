import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { X, Calendar, FileText, AlertCircle } from "lucide-react";
import { createTodo, updateTodo } from "../store/todosSlice";
import { cn } from "../utils/cn";

const TodoModal = ({ isOpen, onClose, todo = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    content: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (todo) {
      setFormData({
        content: todo.content || "",
        description: todo.description || "",
        priority: todo.priority || "medium",
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData({
        content: "",
        description: "",
        priority: "medium",
        dueDate: "",
      });
    }
    setErrors({});
  }, [todo, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.content.trim()) {
      newErrors.content = "Todo content is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const todoData = {
      content: formData.content.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
    };

    if (formData.dueDate) {
      todoData.dueDate = new Date(formData.dueDate).toISOString();
    }

    try {
      if (todo) {
        await dispatch(updateTodo({ id: todo._id, data: todoData })).unwrap();
      } else {
        await dispatch(createTodo(todoData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                    {todo ? "Edit Todo" : "Create New Todo"}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Content */}
                  <div>
                    <label
                      htmlFor="content"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Todo Content *
                    </label>
                    <input
                      type="text"
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="What needs to be done?"
                      className={cn(
                        "w-full rounded-lg border bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500",
                        errors.content ? "border-red-500" : "border-gray-600"
                      )}
                    />
                    {errors.content && (
                      <div className="mt-1 flex items-center text-sm text-red-400">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors.content}
                      </div>
                    )}
                  </div>

                  {/* Description */}
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
                      placeholder="Add more details..."
                      rows={3}
                      className="w-full resize-none rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label
                      htmlFor="priority"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label
                      htmlFor="dueDate"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      <Calendar className="mr-1 inline h-4 w-4" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-300 transition-colors hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      {todo ? "Update" : "Create"} Todo
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

export default TodoModal;
