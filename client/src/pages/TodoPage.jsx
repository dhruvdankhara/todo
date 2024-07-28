import { useEffect, useState } from "react";
import { TodoForm, TodoItem } from "../components";

import { useSelector, useDispatch } from "react-redux";
import { fetchAllTodos } from "../features/todo/todoSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function TodoPage() {
  const todos = useSelector((state) => state.todos.todos);
  const isLoading = useSelector((state) => state.todos.isLoading);
  const [option, setOption] = useState("all");
  const { isLogged } = useSelector((state) => state.auth);

  const dispacth = useDispatch();
  const navigate = useNavigate();

  const allTodo = () => {
    setOption("all");
  };
  const pendingTodo = () => {
    setOption(false);
  };
  const competedTodo = () => {
    setOption(true);
  };

  useEffect(() => {
    if (!isLogged) {
      toast.error("Please login to see your todos");
      navigate("/login");
    } else {
      dispacth(fetchAllTodos());
    }
  }, [navigate, dispacth, isLogged]);

  return (
    <div className="min-h-screen ">
      <div className="w-full max-w-2xl mx-auto mt-16 shadow-lg rounded-3xl p-10 border border-black">
        <h1 className="text-3xl font-bold text-center mb-8 mt-2">Your Todos</h1>
        <div className="mb-4">
          <TodoForm />
        </div>
        <div className="flex justify-center items-center gap-8 my-8 text-base font-bold ">
          <div
            className={`cursor-pointer ${
              option == "all" ? "border-b-4 border-black" : ""
            } transition duration-500`}
            onClick={allTodo}
          >
            All
          </div>
          <div
            className={`cursor-pointer ${
              !option ? "border-b-4 border-black" : ""
            } transition duration-500`}
            onClick={pendingTodo}
          >
            Pending
          </div>
          <div
            className={`cursor-pointer ${
              option == true ? "border-b-4 border-black" : ""
            } transition duration-500`}
            onClick={competedTodo}
          >
            Completed
          </div>
        </div>
        <div className="flex flex-wrap gap-y-3">
          {isLoading ? (
            <div>Loading...</div>
          ) : todos && todos.length > 0 ? (
            todos.map((todo) => {
              if (option == "all") {
                return (
                  <div key={todo._id} className="w-full">
                    <TodoItem todo={todo} />
                  </div>
                );
              } else if (todo.isCompleted == option) {
                return (
                  <div key={todo._id} className="w-full">
                    <TodoItem todo={todo} />
                  </div>
                );
              }
            })
          ) : (
            <div className="text-center font-bold">
              No Todos Found! Please add some todos to see here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoPage;
