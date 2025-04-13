import React, { useEffect, useRef, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
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
import { FcDeleteDatabase } from "react-icons/fc";

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

const Formaldehyde: React.FC = () => {
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

  const isDailyInitialized = useRef(false);

  useEffect(() => {
    if (filterType === 'monthly') {
      fetchMonthlyData();
    } else if (filterType === 'yearly') {
      fetchYearlyData();
    } else if (filterType === 'daily') {
      if (!isDailyInitialized.current) {
        const today = dayjs();
        const sevenDaysLater = today.add(7, 'day');
        setStartDate(today.format("YYYY-MM-DD"));
        setEndDate(sevenDaysLater.format("YYYY-MM-DD"));
        isDailyInitialized.current = true;
      }
      fetchDailyData();
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
      const results = res?.data?.map((item: any) => ({
        date: dayjs(item.Date).format("D"),
        Formaldehyde: item?.Formaldehyde ?? 0,
      }));

      setData(results);
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }

    setLoading(false);
  };

  const isDataEmpty = data.every(item => item.Formaldehyde === 0);

  return (
    <VisitorsBlockWrap>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <BlockTitle className="block-title">
          <h3 style={{backgroundColor:"#9D54F9",width:"240px",borderRadius:"5px",height:"40px",display:"flex",justifyContent:"center",alignItems:"center",color:"white"}}>Formaldehyde Data</h3>
        </BlockTitle>

        <div className="flex gap-2 w-full md:w-auto md:ml-auto">
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="select-filter-type-label">Filter Type</InputLabel>
            <Select
              labelId="select-filter-type-label"
              multiple
              value={[filterType]}
              label="Filter Type"
              onChange={(e) => {
                const selected = e.target.value as string[];
                if (selected.length > 0) {
                  setFilterType(selected[selected.length - 1] as 'daily' | 'monthly' | 'yearly');
                }
              }}
              renderValue={(selected) =>
                (selected as string[]).map((value) => {
                  switch (value) {
                    case 'monthly': return 'Month';
                    case 'yearly': return 'Year';
                    case 'daily': return 'Day';
                    default: return value;
                  }
                }).join(', ')
              }
            >
              {[
                { value: 'monthly', label: 'Month' },
                { value: 'yearly', label: 'Year' },
                { value: 'daily', label: 'Day' },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={filterType === option.value} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* เงื่อนไขแบบ Monthly */}
          {filterType === 'monthly' && (
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="select-filter-type-label">Year</InputLabel>
              <Select
                value={year}
                labelId="select-filter-type-label"
                label="Year"
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {[2022, 2023, 2024, 2025].map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* เงื่อนไขแบบ Yearly */}
          {filterType === 'yearly' && (
            <>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Start Year</InputLabel>
                <Select
                  value={startYear}
                  label="Start Year"
                  onChange={(e) => setStartYear(Number(e.target.value))}
                >
                  {[2022, 2023, 2024, 2025, 2026, 2027].map((y) => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>End Year</InputLabel>
                <Select
                  value={endYear}
                  label="End Year"
                  onChange={(e) => setEndYear(Number(e.target.value))}
                >
                  {[2022, 2023, 2024, 2025, 2026, 2027].map((y) => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {filterType === 'daily' && (
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>To</span>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <BlockContentWrap className="line-chart">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : isDataEmpty ? (
          <div className="text-center text-gray-500 py-10 text-[32px] font-[600] flex justify-center">Sorry, no data available <FcDeleteDatabase size={40} className="ml-1 mt-2" /></div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 14, right: 5, left: -17, bottom: 0 }}
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
                  label={{
                    value: 'ppm',
                    position: 'top',
                    fill: "#7B91B0",
                    fontSize: 14,
                    className: 'ppm-label',
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
                  name={`Formaldehyde (${filterType === "daily" ? "Day" : filterType === "monthly" ? "Month" : "Year"})`}
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

export default Formaldehyde;
