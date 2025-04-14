import React, { useEffect, useState } from "react";
import { ListDataHardware } from "../../../services/https";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { TbTemperatureSun } from "react-icons/tb";

import {
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
    TooltipProps,
} from "recharts";
import { BlockContentWrap, BlockTitle } from "../../../style/global/default";
import { CustomerWrap } from "./Temp_Humi.styles";
import dayjs from "dayjs";
import { useRef } from "react";
import {
    FindDataHardwareByMonth,
    FindDataHardwareByYear,
    FindDataHardwareByDateRange,
} from "../../../services/https";

import {
    BarChart,
    Bar,
} from "recharts";
import { VolumeServiceWrap } from "./TempVSHumi.styles";

interface ChartData {
    month?: string;
    year?: string;
    date?: string;
    Tempreture: number;
    Humidity: number;
}



interface CustomTooltipProps extends TooltipProps<number, string> { }

const CustomTooltipContent = ({ payload }: CustomTooltipProps) => {
    if (!payload || !payload.length) return null;
    return (
        <div className="custom-recharts-tooltip">
            <p className="recharts-tooltip-label">{payload[0].payload?.month || payload[0].payload?.year || payload[0].payload?.date}</p>
            <ul className="recharts-tooltip-item-list">
                {payload.map((item, index) => (
                    <li key={index}>{`${item.name?.replace("_", " ")}: ${item.value}`}</li>
                ))}
            </ul>
        </div>
    );
};  
// @ts-ignore
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const item = payload[0].payload as {
        Tempreture: number;
        Humidity: number;
        date?: string;
        month?: string;
        year?: string;
      };
  
      return (
        <div className="bg-white border p-2 rounded shadow text-sm">
          <p className="recharts-tooltip-label font-semibold mb-1">
            {item.date || item.month || item.year || "No date"}
          </p>
          <p className="text-blue-500">Tempreture: {item.Tempreture}</p>
          <p className="text-green-500">Humidity: {item.Humidity}</p>
        </div>
      );
    }
  
    return null;
  };


const formatLegendValue = (
    value: string,
): React.ReactNode => {
    return (
        <span className="custom-legend-item-text-group">
            <span className="custom-legend-item-text">{value}</span>
            <span className="custom-legend-item-text"></span>
        </span>
    );
};


const Temp_Humi = () => {
    const [hardwareData, setHardwareData] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(["Temperature", "Humidity"]);
    const [searchText, setSearchText] = useState<string>("");
    const [csvData, setCsvData] = useState<any[]>([]);
    const [downloadFilename, setDownloadFilename] = useState("hardware-data.csv");
    const [downloadNow, setDownloadNow] = useState(false);
    const currentYear = dayjs().year();
    const [year, setYear] = useState<number>(currentYear);
    const [startYear, setStartYear] = useState<number>(2024);
    const [endYear, setEndYear] = useState<number>(2025);
    const [data, setData] = useState<ChartData[]>([]);
    const [filterType, setFilterType] = useState<'monthly' | 'yearly' | 'daily'>('monthly');
    const [startDate, setStartDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState<string>(dayjs().add(7, 'day').format("YYYY-MM-DD"));
    const isDailyInitialized = useRef(false);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    useEffect(() => {
        if (filterType === 'monthly') fetchMonthlyData();
        else if (filterType === 'yearly') fetchYearlyData();
        else if (filterType === 'daily') {
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
        const results = await Promise.all(
            Array.from({ length: 12 }, (_, i) => FindDataHardwareByMonth(i + 1, year))
        );
        const formatted = results.map((res, index) => ({
            month: monthNames[index],
            Humidity: res?.data?.[0]?.Humidity ?? 0,
            Tempreture: res?.data?.[0]?.Tempreture ?? 0,
        }));
        setData(formatted);
    };

    const fetchYearlyData = async () => {
        const allYearData: ChartData[] = [];
        for (let y = startYear; y <= endYear; y++) {
            const res = await FindDataHardwareByYear(y);
            const arr = res?.data || [];
            const tempSum = arr.reduce((sum: number, item: ChartData) => sum + (item?.Tempreture || 0), 0);
            const humSum = arr.reduce((sum: number, item: ChartData) => sum + (item?.Humidity || 0), 0);
            const count = arr.length;
            allYearData.push({ year: `${y}`, Tempreture: tempSum / count || 0, Humidity: humSum / count || 0 });
        }
        setData(allYearData);
    };

    const fetchDailyData = async () => {
        const res = await FindDataHardwareByDateRange(startDate, endDate);
        const results = res?.data?.map((item: any) => ({
            date: dayjs(item.Date).format("DD/MM"),
            Humidity: item?.Humidity ?? 0,
            Tempreture: item?.Tempreture ?? 0,
        })) ?? [];
        setData(results);
    };
    // @ts-ignore
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleColumnChange = (event: any) => {
        const { target: { value } } = event;
        setSelectedColumns(typeof value === "string" ? value.split(",") : value);
    };

    const getAllDataForCSV = () => {
        return hardwareData.map((item, index) => ({
            "No": index + 1,
            Date: item.Date,
            Temperature: item.Tempreture,
            Humidity: item.Humidity,
        }));
    };

    const filteredData = hardwareData.filter(
        (item) =>
            item.Tempreture.toString().toLowerCase().includes(searchText.toLowerCase()) ||
            item.Humidity.toString().toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            const res = await ListDataHardware();
            if (res?.status === 200) {
                setHardwareData(res.data);
            } else {
                console.error("Error fetching data hardware", res);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (downloadNow) {
            document.getElementById("hiddenCSVDownloader")?.click();
            setDownloadNow(false);
        }
    }, [downloadNow]);

    return (
        <>
            <div className="contentMain flex justify-center">
                <div className="contentRight py-8 px-14 w-full">
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "15px", justifyContent: "space-between" }}>
                        <h3 style={{
                            backgroundColor: "#F9AB31",
                            width: "320px",
                            borderRadius: "5px",
                            height: "45px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            fontSize: "20px",
                        }}>
                            Temp & Humidity Graph <TbTemperatureSun size={25} className='ml-2' />
                        </h3>

                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <FormControl sx={{ minWidth: 150 }} size="small">
                                <InputLabel>Filter</InputLabel>
                                <Select value={filterType} label="Filter" onChange={(e) => setFilterType(e.target.value as any)}>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                    <MenuItem value="yearly">Yearly</MenuItem>
                                    <MenuItem value="daily">Daily</MenuItem>
                                </Select>
                            </FormControl>

                            {filterType === "monthly" && (
                                <FormControl sx={{ minWidth: 120 }} size="small">
                                    <InputLabel>Year</InputLabel>
                                    <Select value={year} label="Year" onChange={(e) => setYear(Number(e.target.value))}>
                                        {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                                            <MenuItem key={y} value={y}>{y}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {filterType === "yearly" && (
                                <>
                                    <FormControl sx={{ minWidth: 120 }} size="small">
                                        <InputLabel>Start Year</InputLabel>
                                        <Select value={startYear} label="Start Year" onChange={(e) => setStartYear(Number(e.target.value))}>
                                            {[2022, 2023, 2024, 2025].map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: 120 }} size="small">
                                        <InputLabel>End Year</InputLabel>
                                        <Select value={endYear} label="End Year" onChange={(e) => setEndYear(Number(e.target.value))}>
                                            {[2022, 2023, 2024, 2025].map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </>
                            )}

                            {filterType === "daily" && (
                                <div className="flex items-center gap-2">
                                    <FormControl size="small">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                                        />
                                    </FormControl>
                                    <span>To</span>
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
                    </div><br />

                    <div className="flex gap-4 px-0 py-0 w-full">
                        <div className="flex-1">
                            <CustomerWrap>
                                <BlockTitle className="block-title">
                                    <h3>Temperature AND Humidity</h3>
                                </BlockTitle>
                                <div className="flex flex-wrap gap-2 w-full md:w-auto md:ml-auto items-center">
                                </div>

                                <BlockContentWrap className="area-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0095FF" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#0095FF" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="humColor" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#07E098" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#07E098" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip content={<CustomTooltipContent />} />
                                            <Legend />
                                            <Area type="monotone" dataKey="Tempreture" stroke="#0095FF" fillOpacity={1} fill="url(#tempColor)" strokeWidth={2} dot={{ stroke: "#0095FF", fill: "#0095FF" }} />
                                            <Area type="monotone" dataKey="Humidity" stroke="#07E098" fillOpacity={1} fill="url(#humColor)" strokeWidth={2} dot={{ stroke: "#07E098", fill: "#07E098" }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </BlockContentWrap>
                            </CustomerWrap>
                        </div>
                        <div className="flex-1">
                            <VolumeServiceWrap style={{ flex: 1 }}>
                                <div className="block-head">
                                    <BlockTitle className="block-title">
                                        <h3>Tempreture vs Humidity</h3>
                                    </BlockTitle>
                                </div>
                                <BlockContentWrap className="stacked-bar-chart">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={data}
                                            margin={{ top: 5, right: 5, left: 5 }}
                                        >
                                            
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                                            <Legend
                                                iconType="circle"
                                                iconSize={10}
                                                formatter={formatLegendValue}
                                            />
                                            <Bar
                                                dataKey="Tempreture"
                                                stackId="a"
                                                fill="#0095FF"
                                                radius={[0, 0, 4, 4]}
                                                barSize={16}
                                            />
                                            <Bar
                                                dataKey="Humidity"
                                                stackId="a"
                                                fill="#00E096"
                                                radius={[4, 4, 0, 0]}
                                                barSize={16}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </BlockContentWrap>
                            </VolumeServiceWrap>
                        </div>
                    </div>
                    <div className="card my-5 shadow-md sm:rounded-lg bg-white border-[hsla(0,0%,0%,0)] px-3 py-3">
                        <div className="flex items-center justify-between px-3 py-2">
                            <h2 className="text-[18px] font-[700]">Temperature AND Humidity All Data</h2>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="border rounded-md p-1"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <Button className="btn-blue !capitalize" onClick={() => {
                                    setCsvData(getAllDataForCSV());
                                    setDownloadFilename("all-hardware-data.csv");
                                    setDownloadNow(true);
                                }}>
                                    Download CSV
                                </Button>

                                <FormControl sx={{ minWidth: 200 }} size="small">
                                    <InputLabel id="select-columns-label">Show Columns</InputLabel>
                                    <Select
                                        labelId="select-columns-label"
                                        multiple
                                        value={selectedColumns}
                                        onChange={handleColumnChange}
                                        label="Show Columns"
                                        renderValue={(selected) => (selected as string[]).join(", ")}
                                    >
                                        {["Temperature", "Humidity"].map((col) => (
                                            <MenuItem key={col} value={col}>
                                                <Checkbox checked={selectedColumns.indexOf(col) > -1} />
                                                <ListItemText primary={col} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="hardware table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No</TableCell>
                                            {selectedColumns.includes("Temperature") && <TableCell>Temperature</TableCell>}
                                            {selectedColumns.includes("Humidity") && <TableCell>Humidity</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item, index) => (
                                                <TableRow hover key={item.ID}>
                                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                    {selectedColumns.includes("Temperature") && <TableCell>{item.Tempreture ?? "-"}</TableCell>}
                                                    {selectedColumns.includes("Humidity") && <TableCell>{item.Humidity ?? "-"}</TableCell>}
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[5, 25, 50, 100]}
                                component="div"
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>

                    {downloadNow && (
                        <CSVLink
                            data={csvData}
                            filename={downloadFilename}
                            className="hidden"
                            target="_blank"
                            id="hiddenCSVDownloader"
                        />
                    )}
                </div>
            </div ></>
    );
};

export default Temp_Humi;
