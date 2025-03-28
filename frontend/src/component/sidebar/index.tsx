import { Link } from "react-router-dom"
import SUTHLOGO from "../../assets/SUTH Logo.png"
import { Button } from "@mui/material"
import { RxDashboard } from "react-icons/rx";

const index = () => {
  return (
    <>
      <div className="sidebar fixed top-0 left-0 bg-[#fff] w-[13%] h-full border-r border-[rgba(0.0.0.0.1)] py-2 px-4">
        <div className="py-2 w-full">
          <Link to="/"><img src={SUTHLOGO} alt="Hospital SUT" className="w-[60%]" /></Link>
        </div>

        <ul className="mt-4">
          <li><Button className="w-full !capitalize !justify-start flex gap-3 !text-[16px] !text-[rgba(0,0,0,8)] !font-[600]">
            <RxDashboard className="text-[16px]" />Dashboard</Button></li>
        </ul>
      </div>
    </>
  )
}

export default index