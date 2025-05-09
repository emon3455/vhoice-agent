import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";

const Main = () => {
  const excludedPaths = ["/", "/"];
  const location = useLocation();
  const { pathname } = location;

//   const hideNavbar = excludedPaths.includes(pathname);
  const hideNavbar = false;

  return (
    <main className="">
      {/* {!hideNavbar && <Navbar />} */}
      <div>
        <Outlet />
      </div>
    </main>
  );
};

export default Main;
