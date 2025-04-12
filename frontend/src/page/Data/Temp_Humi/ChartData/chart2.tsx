import React from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BlockContentWrap, BlockTitle } from "../../../../style/global/default";
import { VolumeServiceWrap } from "./TempVSHumi.styles";

// ประเภทของข้อมูลแต่ละรายการ
interface VolumeServiceDataItem {
  name: string;
  volume: number;
  services: number;
}

export const VOLUME_SERVICE_DATA: VolumeServiceDataItem[] = [
  { name: "A", volume: 400, services: 240 },
  { name: "B", volume: 300, services: 139 },
  { name: "C", volume: 200, services: 980 },
  { name: "D", volume: 278, services: 390 },
  { name: "E", volume: 189, services: 480 },
  { name: "F", volume: 239, services: 380 },
  { name: "G", volume: 349, services: 430 },
];

// ✅ formatter ที่ใช้กับ Legend ของ Recharts
const formatLegendValue = (
  value: string,
  entry: any // ใช้ any แทน LegendPayload
): React.ReactNode => {
  const dataKey = entry.dataKey?.toString() ?? "";
  const totalVal = VOLUME_SERVICE_DATA.reduce((acc, item) => {
    return acc + Number(item[dataKey as keyof VolumeServiceDataItem] ?? 0);
  }, 0);

  return (
    <span className="custom-legend-item-text-group">
      <span className="custom-legend-item-text">{value}</span>
      <span className="custom-legend-item-text">{totalVal}</span>
    </span>
  );
};

const VolumeService: React.FC = () => {
  return (
    <VolumeServiceWrap>
      <div className="block-head">
        <BlockTitle className="block-title">
          <h3>Tempreture vs Humidity</h3>
        </BlockTitle>
      </div>
      <BlockContentWrap className="stacked-bar-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={VOLUME_SERVICE_DATA}
            margin={{ top: 5, right: 5, left: 5 }}
          >
            <Tooltip cursor={{ fill: "transparent" }} />
            <Legend
              iconType="circle"
              iconSize={10}
              formatter={formatLegendValue}
            />
            <Bar
              dataKey="volume"
              stackId="a"
              fill="#0095FF"
              radius={[0, 0, 4, 4]}
              barSize={16}
            />
            <Bar
              dataKey="services"
              stackId="a"
              fill="#00E096"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </BlockContentWrap>
    </VolumeServiceWrap>
  );
};

export default VolumeService;
