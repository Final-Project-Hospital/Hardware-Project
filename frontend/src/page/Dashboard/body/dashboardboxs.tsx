import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaChartPie } from "react-icons/fa";
import { AiOutlineDotChart } from "react-icons/ai";
import { LuChartSpline } from "react-icons/lu";
import { FaTemperatureHigh } from "react-icons/fa6";
import { IoWater } from "react-icons/io5";
import { GiChemicalDrop } from "react-icons/gi";
import { GiWifiRouter } from "react-icons/gi";
import { IoWifi } from "react-icons/io5";
import { RiCelsiusFill } from "react-icons/ri";

const Dashboard = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Not available");

  // เชื่อมต่อ WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://192.168.70.119/ws"); 
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTemperature(data.temperature); 
      setHumidity(data.humidity);
      if (data.status) {
        setStatus(data.status); // ✅ รับค่า status จาก ESP
      }
      console.log(data);
    };

    return () => {
      ws.close(); 
    };
  }, []);

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="dashboardboxesSlider"
      >
        <SwiperSlide>
          <div className='box p-5 cursor-pointer hover:bg-[#f1f1f1] bg-white rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <GiChemicalDrop className='text-[40px] text-purple-600'/>
            <div className='info w-[70%]'>
              <h3>Formaldehyde</h3>
              <b>3.85 ppm.</b>
            </div>
            <AiOutlineDotChart className='text-[40px] text-purple-500'/>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='box p-5 cursor-pointer bg-white hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <FaTemperatureHigh className='text-[40px] text-red-500'/>
            <div className='info w-[70%]'>
              <h3>Temperature</h3>
              <b className='flex'>
                {temperature !== null ? `${temperature.toFixed(1)} ` : 'Loading...'} 
                <RiCelsiusFill className='w-[32px] h-[18px] mt-[3px]'/>
              </b>
            </div>
            <FaChartPie className='text-[40px] text-red-500'/>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='box p-5 cursor-pointer bg-white hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <IoWater className='text-[40px] text-blue-500'/>
            <div className='info w-[70%]'>
              <h3>Humidity</h3>
              <b>{humidity !== null ? `${humidity.toFixed(1)} %` : 'Loading... %'}</b>
            </div>
            <LuChartSpline className='text-[40px] text-blue-500'/>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='box p-5 cursor-pointer bg-white hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <IoWifi className='text-[40px] text-gray-500'/>
            <div className='info w-[70%]'>
              <h3>Status</h3>
              <b>{status}</b> 
            </div>
            <GiWifiRouter className='text-[40px] text-gray-500'/>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default Dashboard;
