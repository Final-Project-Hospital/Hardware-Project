import { BlockContentWrap, BlockTitle } from "../../../../style/global/default";
import { RevenueWrap } from "./tempreture";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// กำหนดประเภทของค่าที่รับเข้าและส่งออกจาก formatter functions
const formatTooltipValue = (value: number): string => {
  return `${value}`;
};

const formatYAxisLabel = (value: number): string => {
  return `${value}`;
};

const formatLegendValue = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const REVENUE_DATA = [
    {
      day: "Mon",
      Tempreture: 14,
      Humidity: 12.5,
    },
    {
      day: "Tue",
      Tempreture: 17,
      Humidity: 12,
    },
    {
      day: "Wed",
      Tempreture: 6,
      Humidity: 23,
    },
    {
      day: "Thu",
      Tempreture: 16,
      Humidity: 7,
    },
    {
      day: "Fri",
      Tempreture: 13,
      Humidity: 12,
    },
    {
      day: "Sat",
      Tempreture: 17,
      Humidity: 13,
    },
    {
      day: "Sun",
      Tempreture: 21,
      Humidity: 12,
    },
  ];

const Revenue = () => {
  return (
    <RevenueWrap>
      <div className="block-head">
        <BlockTitle className="block-title">
          <h3>Tempreture And Humidity Data</h3>
        </BlockTitle>
      </div>
      <BlockContentWrap className="bar-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={REVENUE_DATA}
            margin={{
              top: 5,
              right: 5,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="#f8f8f9"
              horizontal={true}
              vertical={false}
              strokeDasharray="3 0"
            />
            <XAxis
              dataKey="day"
              tickSize={0}
              axisLine={false}
              tick={({ payload, x, y, dy }: any) => (
                <text
                  x={x}
                  y={y + 25}
                  dy={dy}
                  textAnchor="middle"
                  fill="#7B91B0"
                  fontSize={14}
                >
                  {payload.value}
                </text>
              )}
            />
            <YAxis
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
              tick={{
                fill: "#7B91B0",
                fontSize: 14,
              }}
              interval={0}
              ticks={[0, 10, 20, 30, 40, 50]}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value: number) => formatTooltipValue(value)}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              formatter={(value: string) => formatLegendValue(value)}
              style={{
                paddingTop: "10px",
              }}
            />
            <Bar
              dataKey="Tempreture"
              fill="#0095FF"
              activeBar={false}
              isAnimationActive={false}
              radius={[4, 4, 4, 4]}
              barSize={18}
            />
            <Bar
              dataKey="Humidity"
              fill="#fb963c"
              activeBar={false}
              isAnimationActive={false}
              radius={[4, 4, 4, 4]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </BlockContentWrap>
    </RevenueWrap>
  );
};

export default Revenue;
