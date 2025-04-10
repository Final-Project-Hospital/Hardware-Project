import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart2 = () => {
    const [chart1Data, setChart1Data] = useState([
        { name: 'DAY 1', Temperature: 4000, Humidity: 2400, amt: 2400 },
        { name: 'DAY 2', Temperature: 3000, Humidity: 1398, amt: 2210 },
        { name: 'DAY 3', Temperature: 2000, Humidity: 9800, amt: 2290 },
        { name: 'DAY 4', Temperature: 2780, Humidity: 3908, amt: 2000 },
        { name: 'DAY 5', Temperature: 1890, Humidity: 4800, amt: 2181 },
        { name: 'DAY 6', Temperature: 2390, Humidity: 3800, amt: 2500 },
        { name: 'DAY 7', Temperature: 3490, Humidity: 4300, amt: 2100 },
    ]);

    return (
        <div className='card my-4 shadow-md sm:rounded-lg bg-white'>
            <div className='flex items-center justify-between px-5 py-5 pb-0'>
                <h2 className="text-[18px] font-[700]">Formaldehyde Data Chart</h2>
            </div>

            <div className='flex items-center gap-5 px-5 py-5 pt-2'>
                <span className='flex items-center gap-1 text-[15px]'><span className='block w-[8px] h-[8px] rounded-full bg-purple-400'></span>Formaldehyde</span>
            </div>

            <div className="w-full h-[500px] px-5">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chart1Data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize:12}}/>
                        <YAxis tick={{fontSize:12}}/>
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Temperature" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Humidity" stroke="#82ca9d" strokeWidth={3}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Chart2;
