import React, { useEffect, useState } from 'react';
import { CreateDataHardware } from '../../services/https/index'; // อย่าลืมนำเข้าฟังก์ชันที่เราสร้างไว้

const Index = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.70.119/ws'); // เปลี่ยน IP ให้ตรงกับ ESP32

    socket.onopen = () => {
      console.log('✅ WebSocket Connected');
      setConnected(true);
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // เมื่อมีข้อมูลที่ต้องการ
        if (data.temperature !== undefined) setTemperature(data.temperature);
        if (data.humidity !== undefined) setHumidity(data.humidity);

        // สร้างข้อมูล DataHardware ที่จะบันทึก
        const newData = {
          date: new Date().toISOString(), // ใช้เวลาปัจจุบัน
          data: data.temperature, // สมมติว่าเราต้องการบันทึกแค่ข้อมูล temperature
        };

        // เรียกใช้ CreateDataHardware เพื่อบันทึกข้อมูล
        await CreateDataHardware(newData);
        
        console.log('ข้อมูลถูกบันทึกเรียบร้อย');
        
      } catch (err) {
        console.error('❌ Failed to parse data:', err);
      }
    };

    socket.onclose = () => {
      console.log('❌ WebSocket Disconnected');
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h2>🌡️ Realtime Sensor Data from ESP32</h2>
      <p>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      <p>Temperature: {temperature !== null ? `${temperature} °C` : 'Loading...'}</p>
      <p>Humidity: {humidity !== null ? `${humidity} %` : 'Loading...'}</p>
    </div>
  );
};

export default Index;
