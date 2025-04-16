import React, { useEffect, useState } from 'react';
import { database, ref, onValue } from './firebase-config';

interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: string;
}

const SensorDataComponent: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sensorRef = ref(database, '/sensorData');

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // หา key ล่าสุดจาก timestamp
        const keys = Object.keys(data);
        const latestKey = keys.sort().reverse()[0]; // key ที่ใหม่สุด
        const latestData = data[latestKey];

        console.log("Fetched latest data from Firebase:", latestData);  // แสดงค่าล่าสุดเท่านั้น

        setSensorData({
          temperature: latestData.temperature,
          humidity: latestData.humidity,
          timestamp: latestData.timestamp,
        });
        setError(null);
      } else {
        setSensorData(null);
        setError('No data available');
      }
      setLoading(false);
    }, (err) => {
      setError(`Error fetching data: ${err.message}`);
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Sensor Data (Real-time)</h1>
      {sensorData ? (
        <div>
          <p><strong>Timestamp:</strong> {sensorData.timestamp}</p>
          <p><strong>Temperature:</strong> {sensorData.temperature} °C</p>
          <p><strong>Humidity:</strong> {sensorData.humidity} %</p>
        </div>
      ) : (
        <p>No sensor data available</p>
      )}
    </div>
  );
};

export default SensorDataComponent;
