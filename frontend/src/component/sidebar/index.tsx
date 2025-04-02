import { Link } from "react-router-dom"
import SUTHLOGO from "../../assets/SUTH Logo.png"
import { Button } from "@mui/material"
import { RxDashboard } from "react-icons/rx";
import { IoLogOutOutline } from "react-icons/io5";
import { BsDatabase } from "react-icons/bs";
import { GrAnalytics } from "react-icons/gr";

const index = () => {
  return (
    <>
      <div className="sidebar fixed top-0 left-0 bg-[#fff] w-[13%] h-full border-r border-[rgba(0.0.0.0.1)] py-2 px-4">
        <div className="py-2 w-full">
          <Link to="/"><img src={SUTHLOGO} alt="Hospital SUT" className="w-[60%]" /></Link>
        </div>

        <ul className="mt-4">
          <li><Button className="w-full !capitalize !justify-start flex gap-3 !text-[16px] !text-[rgba(0,0,0,8)] !font-[600]">
            <RxDashboard className="text-[16px]" /><span>Dashboard</span>
          </Button>
          </li>

          <li><Button className="w-full !capitalize !justify-start flex gap-3 !text-[16px] !text-[rgba(0,0,0,8)] !font-[600]">
            <GrAnalytics className="text-[16px]" /><span>Analysis</span>
          </Button>
          </li>

          <li><Button className="w-full !capitalize !justify-start flex gap-3 !text-[16px] !text-[rgba(0,0,0,8)] !font-[600]">
            <BsDatabase className="text-[16px]" /><span>Data Hardware</span>
          </Button>
          </li>

          <li><Button className="w-full !capitalize !justify-start flex gap-3 !text-[16px] !text-[rgba(0,0,0,8)] !font-[600]">
            <IoLogOutOutline className="text-[16px]" /><span>Logout</span>
          </Button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default index