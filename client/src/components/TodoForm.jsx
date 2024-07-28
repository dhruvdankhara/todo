import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTodo } from "../features/todo/todoSlice";
import toast from "react-hot-toast";

function TodoForm() {
  const [todo, setTodo] = useState("");

  const dispatch = useDispatch();

  const add = (e) => {
    e.preventDefault();
    if (!todo) {
      toast("Enter todo content.", {
        icon: "ℹ️",
      });
      return;
    }
    dispatch(createTodo(todo));
    setTodo("");
  };

  return (
    <form onSubmit={add} className="flex rounded-full border border-black/50">
      <input
        type="text"
        placeholder="Write Todo here..."
        className="w-full  rounded-l-full px-5 py-3 outline-none duration-150 bg-white/20 capitalize font-semibold"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-r-full px-10 py-1 bg-indigo-500 text-white uppercase font-bold shrink-0 hover:bg-indigo-600 transition duration-150"
      >
        Add
      </button>
    </form>
  );
}

export default TodoForm;
