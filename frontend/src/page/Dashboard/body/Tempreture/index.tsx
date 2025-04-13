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
import dayjs from "dayjs";
import {
  FindDataHardwareByMonth,
  FindDataHardwareByYear,
  FindDataHardwareByDateRange,
} from "../../../../services/https";
  // @ts-ignore
import React, { useEffect, useRef, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { FcDeleteDatabase } from "react-icons/fc";

type ChartData = {
  month?: string;
  year?: string;
  date?: string;
  Tempreture: number;
  Humidity: number;
};

const formatTooltipValue = (value: number): string => `${value}`;
const formatYAxisLabel = (value: number): string => `${value}`;
const formatLegendValue = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const TempANDHumid = () => {
  const currentYear = dayjs().year();
  const [year, setYear] = useState<number>(currentYear);
  const [startYear, setStartYear] = useState<number>(2024);
  const [endYear, setEndYear] = useState<number>(2025);
  const [data, setData] = useState<ChartData[]>([]);
    // @ts-ignore
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'monthly' | 'yearly' | 'daily'>('monthly');
  const [startDate, setStartDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState<string>(dayjs().add(7, 'day').format("YYYY-MM-DD"));
  const isDailyInitialized = useRef(false);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

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
        const Humidity = res?.data?.[0]?.Humidity ?? 0;
        const Tempreture = res?.data?.[0]?.Tempreture ?? 0;
        return {
          month: monthNames[index],
          Humidity,
          Tempreture,
        };
      });

      setData(formatted);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
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

        let tempSum = 0, humSum = 0, count = 0;
        if (Array.isArray(dataArray)) {
          for (const item of dataArray) {
            if (typeof item?.Tempreture === "number" && typeof item?.Humidity === "number") {
              tempSum += item.Tempreture;
              humSum += item.Humidity;
              count++;
            }
          }
        }

        allYearData.push({
          year: `${y}`,
          Tempreture: count ? tempSum / count : 0,
          Humidity: count ? humSum / count : 0,
        });
      }

      setData(allYearData);
    } catch (error) {
      console.error("Error fetching yearly data:", error);
    }
    setLoading(false);
  };

  const fetchDailyData = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);

    try {
      const res = await FindDataHardwareByDateRange(startDate, endDate);
      const results = res?.data?.map((item: any) => ({
        date: dayjs(item.Date).format("DD/MM"),
        Humidity: item?.Humidity ?? 0,
        Tempreture: item?.Tempreture ?? 0,
      })) ?? [];

      setData(results);
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }

    setLoading(false);
  };

  const isAllDataZero = data.every(
    (item) => item.Tempreture === 0 && item.Humidity === 0
  );

  return (
    <RevenueWrap>
      <div className="block-head" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
        <BlockTitle className="block-title">
          <h3>Temp & Humidity Data</h3>
        </BlockTitle>

        <div className="flex gap-2 w-full md:w-auto md:ml-auto">
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterType}
              label="Filter"
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
            </Select>
          </FormControl>

          {filterType === "yearly" && (
            <>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Start Year</InputLabel>
                <Select
                  value={startYear}
                  label="Start Year"
                  onChange={(e) => setStartYear(Number(e.target.value))}
                >
                  {[2022, 2023, 2024, 2025].map((y) => (
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
                  {[2022, 2023, 2024, 2025].map((y) => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {filterType === "monthly" && (
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

          {filterType === "daily" && (
            <div className="flex items-center gap-2 ml-auto">
              <FormControl size="small">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </FormControl><span>To</span>

              <FormControl size="small">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </FormControl>
            </div>
          )}
        </div>
      </div>

      <BlockContentWrap className="bar-chart">
        {isAllDataZero ? (
          <div className="text-center text-gray-500 py-10 text-[32px] font-[600] flex justify-center items-center">
            Sorry, no data available <FcDeleteDatabase size={40} className="ml-2 mt-[2px]" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid stroke="#f8f8f9" strokeDasharray="3 0" />
              <XAxis
                dataKey={filterType === "daily" ? "date" : filterType === "monthly" ? "month" : "year"}
                tick={{ fill: "#7B91B0", fontSize: 14 }}
              />
              <YAxis
                tickFormatter={formatYAxisLabel}
                tick={{ fill: "#7B91B0", fontSize: 14 }}
                ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              />
              <Tooltip formatter={formatTooltipValue} />
              <Legend
                iconType="circle"
                iconSize={10}
                formatter={formatLegendValue}
              />
              <Bar dataKey="Tempreture" fill="#0095FF" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="Humidity" fill="#fb963c" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </BlockContentWrap>
    </RevenueWrap>
  );
};

export default TempANDHumid;
