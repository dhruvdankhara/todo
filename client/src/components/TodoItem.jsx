/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, toggleTodo, updateTodo } from "../features/todo/todoSlice";

function TodoItem({ todo }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.content);

  const todoInputRef = useRef(null);
  const dispacth = useDispatch();

  const deleteTodos = () => {
    dispacth(deleteTodo(todo._id));
  };

  const editTodo = () => {
    dispacth(updateTodo({ id: todo._id, content: todoMsg }));
    setIsTodoEditable(false);
  };

  const toggleCompleted = () => {
    dispacth(toggleTodo(todo._id));
  };

  return (
    <div
      className={`flex border border-black/10 rounded-full px-4 py-2 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black ${
        todo.isCompleted ? "bg-emerald-300" : "bg-slate-300"
      }`}
    >
      <input
        type="checkbox"
        className="cursor-pointer "
        checked={todo.isCompleted}
        onChange={toggleCompleted}
      />
      <input
        type="text"
        className={`border outline-none w-full bg-transparent rounded-lg capitalize font-semibold focus:outline-none focus:ring focus:border-blue-500 ${
          isTodoEditable ? "border-black/10 px-2" : "border-transparent"
        } ${todo.isCompleted ? "line-through" : ""}`}
        value={todoMsg}
        onChange={(e) => setTodoMsg(e.target.value)}
        readOnly={!isTodoEditable}
        ref={todoInputRef}
      />

      <button
        className="inline-flex w-8 h-8 rounded-full text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
        onClick={() => {
          if (todo.isCompleted) return;

          if (isTodoEditable) {
            editTodo();
          } else {
            todoInputRef.current.focus();
            setIsTodoEditable((prev) => !prev);
          }
        }}
        disabled={todo.isCompleted}
      >
        {isTodoEditable ? "💾" : "✏️"}
      </button>

      <button
        className="inline-flex w-8 h-8 rounded-full text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
        onClick={deleteTodos}
      >
        ❌
      </button>
    </div>
  );
}

export default TodoItem;
