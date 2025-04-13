import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import {
  FindDataHardwareByMonth,
  FindDataHardwareByYear,
  FindDataHardwareByDateRange,
} from "../../../../services/https";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { BlockTitle } from "../../../../style/global/default";
import { MdOutlineScience } from "react-icons/md";

const MyComposedChart = () => {
  const currentYear = dayjs().year();
  const [year, setYear] = useState<number>(currentYear);
  const [startYear, setStartYear] = useState<number>(2024);
  const [endYear, setEndYear] = useState<number>(2035);
  const [data, setData] = useState<any[]>([]);// @ts-ignore
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'monthly' | 'yearly' | 'daily'>('monthly');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const isDailyInitialized = useRef(false);

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
          name: month,
          Formaldehyde: formaldehyde,
          uv: formaldehyde,
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
          name: `${y}`,
          Formaldehyde: avgFormaldehyde,
          uv: avgFormaldehyde,
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
        name: dayjs(item.Date).format("D"),
        Formaldehyde: item?.Formaldehyde ?? 0,
        uv: item?.Formaldehyde ?? 0,
      }));

      setData(results);
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }

    setLoading(false);
  };

  return (
    <div className='flex-1'>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <BlockTitle>
          <h3 style={{backgroundColor:"#9D54F9",width:"300px",borderRadius:"5px",height:"45px",display:"flex",justifyContent:"center",alignItems:"center",color:"white",marginBottom:"25px"}}>Formaldehyde Graph<MdOutlineScience size={25} className='ml-2' /></h3>
        </BlockTitle>

        <div className="flex gap-2 w-full md:w-auto md:ml-auto">
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="select-filter-type-label">Filter Type</InputLabel>
            <Select
              labelId="select-filter-type-label"
              multiple
              label="Filter Type"
              value={[filterType]}
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

          {filterType === 'monthly' && (
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                label="Year"
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {[2022, 2023, 2024, 2025].map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Formaldehyde" barSize={20} fill="#AC20E4" />
          <Line type="monotone" dataKey="Formaldehyde" stroke="#E7B4FB" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyComposedChart;
