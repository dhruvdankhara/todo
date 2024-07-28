import { Outlet } from "react-router-dom";
import { NavBar } from "../components";

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default Layout;
