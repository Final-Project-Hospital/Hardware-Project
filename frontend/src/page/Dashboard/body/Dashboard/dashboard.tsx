import DashboardBoxs from "./dashboardboxs"
import picture1 from "../../../../assets/ESP32.png"
import { FaPlus } from "react-icons/fa6";
import { Button } from "@mui/material";
import Chart1 from "../Tempreture";
import Chart2 from "../Formaldehyde/index";
import Avergare from "../AverageDataHareware/index";

const dashboard = () => {

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
              <tr className="odd:bg-white odd:dark:bg-gray-10 even:bg-gray-50 even:dark:bg-gray-100 border-b dark:border-gray-100 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-dark">
                  Apple MacBook Pro 17
                </th>
                <td className="px-6 py-4">
                  Silver
                </td>
                <td className="px-6 py-4">
                  Laptop
                </td>
                <td className="px-6 py-4">
                  $2999
                </td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
              </tr>
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-100 border-b dark:border-gray-100 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-dark">
                  Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">
                  White
                </td>
                <td className="px-6 py-4">
                  Laptop PC
                </td>
                <td className="px-6 py-4">
                  $1999
                </td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
              </tr>
              <tr className="odd:bg-white odd:white:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-100 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-dark">
                  Magic Mouse 2
                </th>
                <td className="px-6 py-4">
                  Black
                </td>
                <td className="px-6 py-4">
                  Accessories
                </td>
                <td className="px-6 py-4">
                  $99
                </td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
              </tr>
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-100 border-b dark:border-gray-100 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-dark">
                  Google Pixel Phone
                </th>
                <td className="px-6 py-4">
                  Gray
                </td>
                <td className="px-6 py-4">
                  Phone
                </td>
                <td className="px-6 py-4">
                  $799
                </td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-dark">
                  Apple Watch 5
                </th>
                <td className="px-6 py-4">
                  Red
                </td>
                <td className="px-6 py-4">
                  Wearables
                </td>
                <td className="px-6 py-4">
                  $999
                </td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
              </tr>
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
