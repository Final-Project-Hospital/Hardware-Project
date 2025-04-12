import { Button } from "@mui/material"
import { AppBarWrap } from "./AppBar.styles";
import Profile from "../../assets/profile-test.jpg"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from "react";
import Divider from '@mui/material/Divider';
import { FaRegUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom"
import SUTHLOGO from "../../assets/SUTH Logo.png"
import Changelanguage from "./language"
import { TbDatabaseImport } from "react-icons/tb";

const AppBar = () => {
  const navigate = useNavigate();

  const [anchorMyAcc, setAnchorMyAcc] = React.useState<null | HTMLElement>(null);
  const openMyAcc = Boolean(anchorMyAcc);

  const handleClickMyAcc = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMyAcc(event.currentTarget);
  };

  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null);
  };

  const [anchorHardware, setAnchorHardware] = React.useState<null | HTMLElement>(null);
  const openHardware = Boolean(anchorHardware);

  const handleClickHardware = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorHardware(event.currentTarget);
  };

  const handleCloseHardware = () => {
    setAnchorHardware(null);
  };

  const handleSelectHardwareType = (type: string) => {
    console.log("Selected:", type);
    // 👉 เช่น navigate ไปหน้าแสดงกราฟ หรือ filter กราฟ
    navigate(`/hardware/${type.toLowerCase()}`); // เช่น /hardware/temperature
    handleCloseHardware();
  };

  return (
    <div>
      <header className="w-full h-[auto] py-2 pl-8 shadow-md pr-7 bg-[#fff] border-b flex items-center justify-between">
        <div className="part1 flex items-center gap-5">
          <Link to="/">
            <img src={SUTHLOGO} alt="Hospital SUT" className="w-[80px]" />
          </Link>

          <Button
            className="!text-black !normal-case flex items-center gap-1"
            onClick={handleClickHardware}
          >
            <span className="text-[16px] font-[600] flex">
              <TbDatabaseImport className="ml-1 w-6 mt-1 mr-1" />
              Data Hardware
            </span>
          </Button>

          <Menu
            anchorEl={anchorHardware}
            open={openHardware}
            onClose={handleCloseHardware}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <MenuItem onClick={() => handleSelectHardwareType("Formaldehyde")}>
              Formaldehyde
            </MenuItem>
            <MenuItem onClick={() => handleSelectHardwareType("temperature_and_humidity")}>
            Temperature AND Humidity
            </MenuItem>
          </Menu>
        </div>

        <div className="part2 w-[40%] flex items-center justify-end">
          <AppBarWrap className="mr-6">
            <Changelanguage />
          </AppBarWrap>

          <div className="relative">
            <div
              className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer"
              onClick={handleClickMyAcc}
            >
              <img src={Profile} className="w-full h-full object-cover" />
            </div>
            <Menu
              anchorEl={anchorMyAcc}
              id="account-menu"
              open={openMyAcc}
              onClose={handleCloseMyAcc}
              onClick={handleCloseMyAcc}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem className="!bg-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                    <img src={Profile} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="info">
                  <h3 className="text-[15px] font-[400] leading-5 ml-2">Tawunchai Burakhon</h3>
                  <p className="text-[12px] font-[400] opacity-70 ml-3">admin-01@gmail.com</p>
                </div>
              </MenuItem>
              <Divider />

              <MenuItem className="flex items-center gap-3">
                <FaRegUser className="text-[16px]" />
                <span className="text-[14px]">Profile</span>
              </MenuItem>

              <MenuItem className="flex items-center gap-3">
                <PiSignOutBold className="text-[18px]" />
                <span className="text-[14px]">Sign Out</span>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </header>
    </div>
  );
};

export default AppBar;
