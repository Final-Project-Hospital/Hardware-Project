import React, { useEffect, useState } from "react";
import { ListDataHardware } from "../../../../services/https";
import DashboardBoxs from "./dashboardboxs";
import picture1 from "../../../../assets/ESP32.png";
import { FaPlus } from "react-icons/fa6";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import Chart1 from "../Tempreture";
import Chart2 from "../Formaldehyde/index";
import Avergare from "../AverageDataHareware/index";
import Progrss from "../../../../component/progress/formaldehyde";
import { CSVLink } from "react-csv";

const Dashboard = () => {
  const [hardwareData, setHardwareData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["Formaldehyde", "Temperature", "Humidity", "Action"]);
  const [searchText, setSearchText] = useState<string>("");

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
        console.log(res.data);
      } else {
        console.error("Error fetching data hardware", res);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="w-full py-2 px-5 border bg-white border-[rgba(0,0,0,0.1)] flex items-center gap-8 mb-5 justify-between rounded-md">
        <div className="info">
          <h1 className="text-[35px] font-bold leading-10 mb-3">Good Morning,<br />Cameroni</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam culpa, ab velit eos totam voluptas!</p>
          <br />
          <Button className="btn-blue !capitalize"><FaPlus className="mr-2" /> Add Hardware IP</Button>
        </div>
        <img src={picture1} className="w-[230px]" />
      </div>

      <DashboardBoxs />

      <div className="card my-5 shadow-md sm:rounded-lg bg-white  border-[hsla(0,0%,0%,0)] px-3 py-3">
        <div className="flex items-center justify-between px-3 py-2">
          <h2 className="text-[18px] font-[700]">Recent Data Hardware</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-md p-1 "
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <CSVLink
              data={hardwareData}
              filename={"hardware-data.csv"}
              className="btn-blue !capitalize"
            >
              Download CSV
            </CSVLink>

            {/* ปุ่มเลือกคอลัมน์ */}
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
                  <TableCell>Data No</TableCell>
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
                          <Progrss value={item.Formaldehyde ?? "-"} type="success" />
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

      <div className="flex gap-4 px-0 py-0">
        <div className="flex-1">
          <Chart1 />
        </div>
        <div className="flex-1">
          <Chart2 />
        </div>
      </div>

      <div className="mt-3">
        <Avergare />
      </div>
    </>
  );
};

export default Dashboard;
