import { lazy } from "react";
import { useRoutes, RouteObject } from "react-router-dom";
import Loadable from "../component/third-patry/Loadable";
import MainLayout from "../layout/MainLayout"; // <-- เพิ่ม Layout

const Dashboard = Loadable(lazy(() => import("../page/Dashboard/index")));
const Test = Loadable(lazy(() => import("../page/Hardware/index")));
const FormaldehydeData = Loadable(lazy(() => import("../page/Data/Formadehyde/Formaldehyde")));
const TemperatureANDHumidityData = Loadable(lazy(() => import("../page/Data/Temp_Humi/Temp_Humi")));

const UserRoutes = (): RouteObject[] => [
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      { path: "", element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "hardware/temperature_and_humidity", element: <TemperatureANDHumidityData /> },
      { path: "hardware/formaldehyde", element: <FormaldehydeData /> },
      { path: "test", element: <Test /> },
    ],
  },
];

function ConfigRoutes() {
  return useRoutes(UserRoutes());
}

export default ConfigRoutes;
