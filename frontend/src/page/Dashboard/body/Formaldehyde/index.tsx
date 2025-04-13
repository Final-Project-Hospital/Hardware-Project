import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { FindDataHardwareByMonth, FindDataHardwareByYear } from "../../../../services/https";
import { BlockContentWrap, BlockTitle } from "../../../../style/global/default";
import { VisitorsBlockWrap } from "./formaldehyde";

// Types
type TooltipPayload = {
  name: string;
  value: number;
  payload: any;
};

type CustomTooltipProps = {
  payload?: TooltipPayload[];
};

type ChartData = {
  month: string;
  Formaldehyde: number;
  year?: string;
};

const formatLegendValue = (value: string): string => {
  return value.replace("_", " ");
};

const formatTooltipValue = (name: string, value: number): string => {
  return `${name.replace("_", " ")}: ${value}`;
};

const CustomTooltipContent: React.FC<CustomTooltipProps> = ({ payload }) => {
  if (!payload || !payload.length) return null;

  return (
    <div className="custom-recharts-tooltip">
      <p className="recharts-tooltip-label">{payload[0].payload?.month}</p>
      <ul className="recharts-tooltip-item-list">
        {payload.map((item, index) => (
          <li key={index}>{formatTooltipValue(item.name, item.value)}</li>
        ))}
      </ul>
    </div>
  );
};

const VisitorsBlock: React.FC = () => {
  const currentYear = dayjs().year();
  const [year, setYear] = useState<number>(currentYear);
  const [startYear, setStartYear] = useState<number>(2024);
  const [endYear, setEndYear] = useState<number>(2035);
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'monthly' | 'yearly'>('monthly'); // เพิ่ม filterType

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        Array.from({ length: 12 }, (_, i) =>
          FindDataHardwareByMonth(i + 1, year)
        )
      );

      console.log(results)

      const formatted = results.map((res, index) => {
        const month = monthNames[index]; // ใช้ค่าเดือนจาก monthNames
        const formaldehyde = res?.data?.[0]?.Formaldehyde ?? 0;
        console.log(formaldehyde)
        return {
          month,
          Formaldehyde: formaldehyde,
        };
      });

      setData(formatted);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const fetchYearlyData = async () => {
    setLoading(true);
    try {
      const allYearData = [];
  
      for (let year = startYear; year <= endYear; year++) {
        const res = await FindDataHardwareByYear(year);
        const dataArray = res?.data;
  
        let avgFormaldehyde = 0;
  
        if (Array.isArray(dataArray)) {
          const values = dataArray
            .map((item: any) => item?.Formaldehyde)
            .filter((val: any) => typeof val === 'number');
  
          const total = values.reduce((sum: number, val: number) => sum + val, 0);
          avgFormaldehyde = values.length > 0 ? total / values.length : 0;
        } else {
          console.warn(`Data for year ${year} is not an array`, dataArray);
        }
  
        allYearData.push({
          month: `${year}`,
          Formaldehyde: avgFormaldehyde,
          year: `${year}`,
        });
      }
  
      setData(allYearData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
  


  useEffect(() => {
    if (filterType === 'monthly') {
      fetchMonthlyData();
    } else {
      fetchYearlyData();
    }
  }, [year, startYear, endYear, filterType]);

  return (
    <VisitorsBlockWrap>
      <div className="block-head flex items-center justify-between">
        <BlockTitle className="block-title">
          <h3>Formaldehyde Data</h3>
        </BlockTitle>

        {/* Radio Buttons สำหรับเลือกประเภทการค้นหา */}
        <div>
          <label>
            <input
              type="radio"
              value="monthly"
              checked={filterType === 'monthly'}
              onChange={() => setFilterType('monthly')}
            />
            ค้นหารายเดือน
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="yearly"
              checked={filterType === 'yearly'}
              onChange={() => setFilterType('yearly')}
            />
            ค้นหารายปี
          </label>
        </div>

        {/* ฟอร์มเลือกปี */}
        {filterType === 'monthly' && (
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}

        {/* ฟอร์มเลือกช่วงปี */}
        {filterType === 'yearly' && (
          <>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <span> ถึง </span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <BlockContentWrap className="line-chart">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#f8f8f9"
                horizontal
                vertical={false}
                strokeDasharray="3 0"
              />
              <XAxis
                dataKey={filterType === 'monthly' ? 'month' : 'year'} // เลือก dataKey ตามประเภทการค้นหา
                tickSize={0}
                axisLine={false}
                padding={{ left: 20 }}
                tick={({ payload, x, y, dy }: any) => (
                  <text
                    x={x}
                    y={y + 20}
                    dy={dy}
                    textAnchor="middle"
                    fill="#7B91B0"
                    fontSize={14}
                  >
                    {filterType === 'monthly' ? payload.value : `${payload.value}`} {/* แสดงปีในกราฟ */}
                  </text>
                )}
              />
              <YAxis
                tickSize={0}
                axisLine={false}
                ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                tick={{
                  fill: "#7B91B0",
                  fontSize: 14,
                }}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend iconType="square" formatter={formatLegendValue} />
              <ReferenceLine
                isFront
                x="May"
                stroke="#F64E60"
                strokeDasharray="3 3"
              />
              <Line
                dot={false}
                strokeWidth={4}
                type="basis"
                dataKey="Formaldehyde"
                stroke="#A700FF"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </BlockContentWrap>
    </VisitorsBlockWrap>
  );
};

export default VisitorsBlock;
