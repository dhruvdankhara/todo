import { useEffect, useState } from "react";
import { TodoForm, TodoItem } from "./components";

import { useSelector, useDispatch } from "react-redux";
import { fetchAllTodos } from "./features/todo/todoSlice";

function App() {
  const todos = useSelector((state) => state.todos);
  const loading = useSelector((state) => state.isLoading);
  const [option, setOption] = useState("all");
  // const [loading, setLoading] = useState(false);

  const dispacth = useDispatch();

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
    dispacth(fetchAllTodos());
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="w-full max-w-2xl mx-auto shadow-lg rounded-3xl p-10 border border-black">
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
          {loading ? (
            <div>Loading...</div>
          ) : todos.length === 0 ? (
            <div>No Todos Found! Please add some todos to see here.</div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
