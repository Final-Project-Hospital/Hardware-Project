import { Button } from "@mui/material"
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { AppBarWrap } from "./AppBar.styles";
import Profile from "../../assets/profile-test.jpg"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from "react";
import Divider from '@mui/material/Divider';
import { FaRegUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { Link } from "react-router-dom"
import SUTHLOGO from "../../assets/SUTH Logo.png"
import { RxDashboard } from "react-icons/rx";
import { BsDatabase } from "react-icons/bs";
import Changelanguage from "./language"
import ProfileReal from "./Profile"

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const index = () => {
  const [anchorMyAcc, setAnchorMyAcc] = React.useState(null)
  const openMyAcc = Boolean(anchorMyAcc)
  const handleClick = (event: any) => {
    setAnchorMyAcc(event.currentTarget)
  };
  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null)
  }

  return (
    <div>
      <header className="w-full h-[auto] py-2 pl-8 shadow-md pr-7 bg-[#fff] border-b flex items-center justify-between">
        <div className="part1">

          <div className="part1 flex items-center gap-5">
            <Link to="/">
              <img src={SUTHLOGO} alt="Hospital SUT" className="w-[80px]" />
            </Link>

            <Button className="!text-black !normal-case flex items-center gap-1">
              <RxDashboard className="text-[16px]" />
              <span className="text-[16px] font-[600]">Dashboard</span>
            </Button>

            <Button className="!text-black !normal-case flex items-center gap-1">
              <BsDatabase className="text-[16px]" />
              <span className="text-[16px] font-[600]">Data Hardware</span>
            </Button>
          </div>

        </div>
        <div className="part2 w-[40%] flex items-center justify-end gap-5">
          <AppBarWrap>
            <Changelanguage />
          </AppBarWrap>

          <div className="relative">
            <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer" onClick={handleClick}>
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
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
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
              <MenuItem onClick={handleCloseMyAcc} className="!bg-white">
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

              <MenuItem onClick={handleCloseMyAcc} className="flex items-center gap-3">
                <FaRegUser className="text-[16px]" /> <span className="text-[14px]">Profile</span>
              </MenuItem>

              <MenuItem onClick={handleCloseMyAcc} className="flex items-center gap-3">
                <PiSignOutBold className="text-[18px]" /> <span className="text-[14px]">Sign Out</span>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </header>
    </div>
  )
}

export default index