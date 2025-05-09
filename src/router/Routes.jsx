import {} from "react";
import { createBrowserRouter } from "react-router-dom";
import Error from "../component/Error";
import HomePage from "../pages/home/HomePage";
import Main from "../layout/Main";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <Error/>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  }
]);

export default router;
