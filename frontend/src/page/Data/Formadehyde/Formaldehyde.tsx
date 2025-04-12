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
  Dialog,
} from "@mui/material";
import { CSVLink } from "react-csv";
import CharData from "./ChartData";


const Formaldehyde = () => {
  const [hardwareData, setHardwareData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["Formaldehyde", "Temperature", "Humidity", "Action"]);
  const [searchText, setSearchText] = useState<string>("");

  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
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
    const {
      target: { value },
    } = event;
    setSelectedColumns(typeof value === "string" ? value.split(",") : value);
  };

  const getAllDataForCSV = () => {
    return hardwareData.map((item, index) => ({
      "No": index + 1,
      Date: item.Date, // เพิ่ม Date เสมอ
      Formaldehyde: item.Formaldehyde,
      Temperature: item.Tempreture,
      Humidity: item.Humidity,
      Action: "Edit",
    }));
  };

  const getSelectedDataForCSV = () => {
    return hardwareData.map((item, index) => {
      const row: any = { "No": index + 1 };

      row["Date"] = item.Date;

      if (selectedColumns.includes("Formaldehyde")) row["Formaldehyde"] = item.Formaldehyde;
      if (selectedColumns.includes("Temperature")) row["Temperature"] = item.Tempreture;
      if (selectedColumns.includes("Humidity")) row["Humidity"] = item.Humidity;
      if (selectedColumns.includes("Action")) row["Action"] = "Edit";

      return row;
    });
  };

  const filteredData = hardwareData.filter(
    (item) =>
      item.Formaldehyde.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      item.Tempreture.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      item.Humidity.toString().toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await ListDataHardware();
      if (res?.status === 200) {
        setHardwareData(res.data);
        console.log(res.data)
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
    <div className="contentMain flex justify-center">
      <div className="contentRight py-8 px-14 w-full">
        <div className="flex gap-4 px-0 py-0">
          <CharData/>
        </div>
        <div className="card my-5 shadow-md sm:rounded-lg bg-white border-[hsla(0,0%,0%,0)] px-3 py-3">
          <div className="flex items-center justify-between px-3 py-2">
            <h2 className="text-[18px] font-[700]">Formaldehyde All Data</h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-md p-1"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button className="btn-blue !capitalize" onClick={() => setOpenDownloadDialog(true)}>
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
                  {["Formaldehyde", "Temperature", "Humidity", "Action"].map((col) => (
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
                    {selectedColumns.includes("Formaldehyde") && <TableCell>Formaldehyde</TableCell>}
                    {selectedColumns.includes("Temperature") && <TableCell>Temperature</TableCell>}
                    {selectedColumns.includes("Humidity") && <TableCell>Humidity</TableCell>}
                    {selectedColumns.includes("Action") && <TableCell>Action</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <TableRow hover key={item.ID}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        {selectedColumns.includes("Formaldehyde") && (
                          <TableCell>
                            <p className="text-[14px] w-[150px] font-semibold">{item.Formaldehyde ?? "-"}</p>
                          </TableCell>
                        )}
                        {selectedColumns.includes("Temperature") && <TableCell>{item.Tempreture ?? "-"}</TableCell>}
                        {selectedColumns.includes("Humidity") && <TableCell>{item.Humidity ?? "-"}</TableCell>}
                        {selectedColumns.includes("Action") && (
                          <TableCell>
                            <a href="#" className="text-blue-600 hover:underline">Edit</a>
                          </TableCell>
                        )}
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

        {/* Download Confirmation Dialog */}
        <Dialog open={openDownloadDialog} onClose={() => setOpenDownloadDialog(false)}>
          <Paper className="p-5">
            <h2 className="text-lg font-semibold mb-4">Download CSV</h2>
            <p className="mb-4">ต้องการดาวน์โหลดข้อมูลทั้งหมดหรือเฉพาะคอลัมน์ที่เลือก?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outlined" onClick={() => {
                setCsvData(getAllDataForCSV());
                setDownloadFilename("all-hardware-data.csv");
                setOpenDownloadDialog(false);
                setDownloadNow(true);
              }}>
                Download All Data
              </Button>
              <Button variant="contained" onClick={() => {
                setCsvData(getSelectedDataForCSV());
                setDownloadFilename("selected-columns.csv");
                setOpenDownloadDialog(false);
                setDownloadNow(true);
              }}>
                Download Selected Columns
              </Button>
            </div>
          </Paper>
        </Dialog>

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
    </div>
  );
};

export default Formaldehyde;
