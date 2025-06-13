import { Outlet } from "react-router-dom";
import FloatingNavbar from "./components/FloatingNavbar";
import { useUIStates } from "./hooks/useUIStates";

const App = () => {
  const uiStates = useUIStates();

  // Use custom event to communicate with TodosPage
  const handleCreateTodo = () => {
    // Dispatch a custom event that TodosPage can listen to
    window.dispatchEvent(new CustomEvent("openTodoModal"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <FloatingNavbar
        onCreateTodo={handleCreateTodo}
        showMobileMenu={uiStates.showMobileMenu}
        setShowMobileMenu={uiStates.setShowMobileMenu}
      />

      <main className="pb-8 pt-20 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-700/50 bg-gray-900/30 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
