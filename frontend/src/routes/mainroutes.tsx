import { lazy } from "react";
import { useRoutes, RouteObject } from "react-router-dom";
import Loadable from "../component/third-patry/Loadable";

const Dashboard = Loadable(lazy(() => import("../page/Dashboard/index")));
const Test = Loadable(lazy(() => import("../page/Hardware/index")));

const UserRoutes = (): RouteObject[] => [
  {
    path: "/", 
    element: <Dashboard />,  
  },
  {
    path: "/dashboard",
    element: <Dashboard />, 
  },
  {
    path: "/test",
    element: <Test />, 
  },
];

function ConfigRoutes() {
  console.log("ConfigRoutes Loaded");
  return useRoutes(UserRoutes());
}

export default ConfigRoutes;
