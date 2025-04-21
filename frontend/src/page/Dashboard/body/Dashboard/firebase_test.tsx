import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../../../../firebaseConfig'; // import firebase db ที่สร้างไว้
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaChartPie } from "react-icons/fa";
import { AiOutlineDotChart } from "react-icons/ai";
import { LuChartSpline } from "react-icons/lu";
import { FaTemperatureHigh } from "react-icons/fa6";
import { IoWater } from "react-icons/io5";
import { GiChemicalDrop, GiWifiRouter } from "react-icons/gi";
import { IoWifi } from "react-icons/io5";
import { RiCelsiusFill } from "react-icons/ri";

const Firebase = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Not available");

  useEffect(() => {
    const sensorRef = ref(db, 'sensorData');

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // หา record ล่าสุดตาม timestamp key
        const entries = Object.entries(data);
        const latestEntry = entries[entries.length - 1][1] as any;
        console.log(latestEntry)
        setTemperature(latestEntry.temperature);
        setHumidity(latestEntry.humidity);
        setStatus("Ready");
      }
    });

    return () => unsubscribe();
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
        {/* Formaldehyde */}
        <SwiperSlide>
          <div className='box p-5 bg-white rounded-md border flex items-center gap-4'>
            <GiChemicalDrop className='text-[40px] text-purple-600'/>
            <div className='info w-[70%]'>
              <h3>Formaldehyde</h3>
              <b>3.85 ppm.</b>
            </div>
            <AiOutlineDotChart className='text-[40px] text-purple-500'/>
          </div>
        </SwiperSlide>

        {/* Temperature */}
        <SwiperSlide>
          <div className='box p-5 bg-white rounded-md border flex items-center gap-4'>
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

        {/* Humidity */}
        <SwiperSlide>
          <div className='box p-5 bg-white rounded-md border flex items-center gap-4'>
            <IoWater className='text-[40px] text-blue-500'/>
            <div className='info w-[70%]'>
              <h3>Humidity</h3>
              <b>{humidity !== null ? `${humidity.toFixed(1)} %` : 'Loading... %'}</b>
            </div>
            <LuChartSpline className='text-[40px] text-blue-500'/>
          </div>
        </SwiperSlide>

        {/* Status */}
        <SwiperSlide>
          <div className='box p-5 bg-white rounded-md border flex items-center gap-4'>
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

export default Firebase;
