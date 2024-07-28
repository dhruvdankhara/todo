import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";

function NavBar() {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const dispacth = useDispatch();

  const logout = () => {
    dispacth(logoutUser());
  };

  return (
    <>
      <div className="flex justify-between px-20 py-5 border-b-2 border-black/20">
        <div>
          <h1 className="font-bold text-2xl">
            <Link to="/">
              Todos<span className="opacity-50">.</span>
            </Link>
          </h1>
        </div>
        <div className="flex items-center gap-x-8">
          <div>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "font-semibold text-lg" : ""}`
              }
            >
              Home
            </NavLink>
          </div>
          <div>
            <NavLink
              to="todos"
              className={({ isActive }) =>
                `${isActive ? "font-semibold text-lg" : ""}`
              }
            >
              Todos
            </NavLink>
          </div>
          {!isLogged ? (
            <>
              <div>
                <NavLink
                  to="login"
                  className={({ isActive }) =>
                    `${isActive ? "font-semibold text-lg" : ""}`
                  }
                >
                  Login
                </NavLink>
              </div>
              <div>
                <NavLink
                  to="register"
                  className={({ isActive }) =>
                    `${isActive ? "font-semibold text-lg" : ""}`
                  }
                >
                  Register
                </NavLink>
              </div>
            </>
          ) : (
            <div>
              <NavLink onClick={logout} className="font-semibold text-base">
                Logout
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NavBar;
