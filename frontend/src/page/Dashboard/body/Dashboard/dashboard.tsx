import { useEffect, useState } from "react";
import { ListDataHardware } from "../../../../services/https";
import DashboardBoxs from "./dashboardboxs"
import picture1 from "../../../../assets/ESP32.png"
import { FaPlus } from "react-icons/fa6";
import { Button } from "@mui/material";
import Chart1 from "../Tempreture";
import Chart2 from "../Formaldehyde/index";
import Avergare from "../AverageDataHareware/index";

const dashboard = () => {

  const [hardwareData, setHardwareData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await ListDataHardware();
      if (res?.status === 200) {
        setHardwareData(res.data);
        console.log(res.data)
      } else {
        console.error("Error fetching data hardware", res);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="w-full py-2 px-5 border bg-white border-[rgba(0,0,0,0.1)] flex items-center gap-8 mb-5 justify-between rounded-md">
        <div className="info">
          <h1 className="text-[35px] font-bold leading-10 mb-3">Good Morning,<br />
            Cameroni</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam culpa, ab velit eos totam voluptas!</p>
          <br />
          <Button className="btn-blue !capitalize"><FaPlus className="mr-2" /> Add Hardware IP</Button>
        </div>

        <img src={picture1} className="w-[230px]" />


      </div>
      <DashboardBoxs />

      <div className="card my-5 shadow-md sm:rounded-lg bg-white border border-[rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between px-5 py-5">
          <h2 className="text-[18px] font-[700]">Recent Data Hardware</h2>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-20 dark:bg-gray-50 dark:text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Data No
                </th>
                <th scope="col" className="px-6 py-3">
                  Formaldehyde
                </th>
                <th scope="col" className="px-6 py-3">
                  Temperature
                </th>
                <th scope="col" className="px-6 py-3">
                  Humidity
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {hardwareData.map((item: any, index: number) => (
                <tr
                  key={item.ID || index}
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{item.Formaldehyde ?? "-"}</td>
                  <td className="px-6 py-4">{item.Tempreture ?? "-"}</td>
                  <td className="px-6 py-4">{item.Humidity ?? "-"}</td>
                  <td className="px-6 py-4">
                    <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex gap-4 px-0 py-0">
        <div className="flex-1">
          <Chart1 />
        </div>
        <div className="flex-1">
          <Chart2 />
        </div>
      </div>
      <div className="mt-3">
        <Avergare />
      </div>
    </>
  )
}

export default dashboard
