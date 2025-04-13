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
import CharData1 from "./ChartData/chart1";
import CharData2 from "./ChartData/chart2";
import { TbTemperatureSun } from "react-icons/tb";

const Temp_Humi = () => {
    const [hardwareData, setHardwareData] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(["Temperature", "Humidity"]);
    const [searchText, setSearchText] = useState<string>("");
    const [csvData, setCsvData] = useState<any[]>([]);
    const [downloadFilename, setDownloadFilename] = useState("hardware-data.csv");
    const [downloadNow, setDownloadNow] = useState(false);
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
                <div className="contentRight py-8 px-14 w-full"><strong>
                    <h3 style={{ backgroundColor: "#F9AB31", width: "320px", borderRadius: "5px", height: "45px", display: "flex", justifyContent: "center", alignItems: "center", color: "white", marginBottom: "15px", fontSize: "20px" }}>Temp & Humidity Graph<TbTemperatureSun size={25} className='ml-2' /></h3></strong>
                    <div className="flex gap-4 px-0 py-0 w-full">
                        <div className="flex-1">
                            <CharData1 />
                        </div>
                        <div className="flex-1">
                            <CharData2 />
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
            </div></>
    );
};

export default Temp_Humi;
