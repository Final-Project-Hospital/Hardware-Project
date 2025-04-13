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
import {
  FindDataHardwareByMonth,
  FindDataHardwareByYear,
  FindDataHardwareByDateRange,
} from "../../../../services/https";
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
  month?: string;
  year?: string;
  date?: string;
  Formaldehyde: number;
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
      <p className="recharts-tooltip-label">{payload[0].payload?.date}</p>
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
  const [filterType, setFilterType] = useState<'monthly' | 'yearly' | 'daily'>('monthly');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    if (filterType === 'monthly') {
      fetchMonthlyData();
    } else if (filterType === 'yearly') {
      fetchYearlyData();
    } else if (filterType === 'daily') {
      // Set default start and end date when "daily" filter is selected
      const today = dayjs();
      const sevenDaysLater = today.add(7, 'day');

      setStartDate(today.format("YYYY-MM-DD"));
      setEndDate(sevenDaysLater.format("YYYY-MM-DD"));

      fetchDailyData(); // Fetch data for the default range
    }
  }, [year, startYear, endYear, startDate, endDate, filterType]);

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        Array.from({ length: 12 }, (_, i) =>
          FindDataHardwareByMonth(i + 1, year)
        )
      );
      const formatted = results.map((res, index) => {
        const month = monthNames[index];
        const formaldehyde = res?.data?.[0]?.Formaldehyde ?? 0;
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
      for (let y = startYear; y <= endYear; y++) {
        const res = await FindDataHardwareByYear(y);
        const dataArray = res?.data;

        let avgFormaldehyde = 0;

        if (Array.isArray(dataArray)) {
          const values = dataArray
            .map((item: any) => item?.Formaldehyde)
            .filter((val: any) => typeof val === 'number');

          const total = values.reduce((sum: number, val: number) => sum + val, 0);
          avgFormaldehyde = values.length > 0 ? total / values.length : 0;
        }

        allYearData.push({
          year: `${y}`,
          Formaldehyde: avgFormaldehyde,
        });
      }
      setData(allYearData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const fetchDailyData = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    try {
      if (end.isBefore(start)) {
        setEndDate(start.format("YYYY-MM-DD"));
      }

      const res = await FindDataHardwareByDateRange(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
      
      // แปลงข้อมูลวันที่ให้แสดงเป็นวันที่เท่านั้น (1, 2, 3 เป็นต้น)
      const results = res?.data?.map((item: any) => ({
        date: dayjs(item.Date).format("D"),  // แปลง Date เป็นวันที่
        Formaldehyde: item?.Formaldehyde ?? 0,
      }));

      console.log(results);
      setData(results); 
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }

    setLoading(false);
  };

  return (
    <VisitorsBlockWrap>
      <div className="block-head flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <BlockTitle className="block-title">
          <h3>Formaldehyde Data</h3>
        </BlockTitle>

        <div className="flex items-center gap-4">
          <label>
            <input
              type="radio"
              value="monthly"
              checked={filterType === 'monthly'}
              onChange={() => setFilterType('monthly')}
            /> ค้นหารายเดือน
          </label>
          <label>
            <input
              type="radio"
              value="yearly"
              checked={filterType === 'yearly'}
              onChange={() => setFilterType('yearly')}
            /> ค้นหารายปี
          </label>
          <label>
            <input
              type="radio"
              value="daily"
              checked={filterType === 'daily'}
              onChange={() => setFilterType('daily')}
            /> ค้นหารายวัน
          </label>
        </div>

        {/* เงื่อนไขแสดง input filter */}
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

        {filterType === 'yearly' && (
          <>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
            >
              {[...Array(12)].map((_, i) => {
                const y = 2024 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
            <span> ถึง </span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
            >
              {[...Array(12)].map((_, i) => {
                const y = 2024 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </>
        )}

        {filterType === 'daily' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>ถึง</span>
            <input
              type="date"
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}
      </div>

      <BlockContentWrap className="line-chart">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <>
            <div className="text-center text-gray-500 py-2">
              {filterType === 'daily' && startDate && endDate ? (
                <p>From {dayjs(startDate).format('D MMM, YYYY')} to {dayjs(endDate).format('D MMM, YYYY')}</p>
              ) : null}
            </div>
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
                  dataKey={
                    filterType === 'monthly'
                      ? 'month'
                      : filterType === 'yearly'
                      ? 'year'
                      : 'date'
                  }
                  tickSize={0}
                  axisLine={false}
                  tick={({ payload, x, y, dy }: any) => (
                    <text
                      x={x}
                      y={y + 20}
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
                <ReferenceLine isFront x="May" stroke="#F64E60" strokeDasharray="3 3" />
                <Line
                  dot={false}
                  strokeWidth={4}
                  type="basis"
                  dataKey="Formaldehyde"
                  stroke="#A700FF"
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </BlockContentWrap>
    </VisitorsBlockWrap>
  );
};

export default VisitorsBlock;
