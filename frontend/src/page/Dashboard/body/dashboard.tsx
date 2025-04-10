import DashboardBoxs from "./dashboardboxs"
import picture1 from "../../../assets/ESP32.png"
import { FaPlus } from "react-icons/fa6";
import { Button } from "@mui/material";

const dashboard = () => {
  return (
    <>
    <div className="w-full py-2 px-5 border bg-white border-[rgba(0,0,0,0.1)] flex items-center gap-8 mb-5 justify-between rounded-md">
        <div className="info">
            <h1 className="text-[35px] font-bold leading-10 mb-3">Good Morning,<br />
            Cameroni</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam culpa, ab velit eos totam voluptas!</p>
              <br />
            <Button className="btn-blue !capitalize"><FaPlus className="mr-2"/> Add Hardware IP</Button>
        </div>

        <img src={picture1} className="w-[230px]" />


    </div>
    <DashboardBoxs/>
    </>
  )
}

export default dashboard
