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
import { BlockContentWrap, BlockTitle } from "../../../../style/global/default";
import { VisitorsBlockWrap } from "./formaldehyde";
import React from "react";

const VISITORS_DATA = [
  {
    month: "Jan",
    Formaldehyde: 1,
  },
  {
    month: "Feb",
    Formaldehyde: 2,
  },
  {
    month: "Mar",
    Formaldehyde: 5,
  },
  {
    month: "Apr",
    Formaldehyde: 3,
  },
  {
    month: "May",
    Formaldehyde: 1,
  },
  {
    month: "Jun",
    Formaldehyde: 1,
  },
  {
    month: "Jul",
    Formaldehyde: 2,
  },
  {
    month: "Aug",
    Formaldehyde: 4,
  },
  {
    month: "Sept",
    Formaldehyde: 3,
  },
  {
    month: "Oct",
    Formaldehyde: 3,
  },
  {
    month: "Nov",
    Formaldehyde: 2,
  },
  {
    month: "Dec",
    Formaldehyde: 1,
  },
];

// Types
type TooltipPayload = {
  name: string;
  value: number;
  payload: any;
};

type CustomTooltipProps = {
  payload?: TooltipPayload[];
};

// Formatters
const formatLegendValue = (value: string): string => {
  return value.replace("_", " ");
};

const formatTooltipValue = (name: string, value: number): string => {
  return `${name.replace("_", " ")}: ${value}`;
};

// Custom Tooltip Component
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
  return (
    <VisitorsBlockWrap>
      <div className="block-head">
        <BlockTitle className="block-title">
          <h3>Formaldehyde Data</h3>
        </BlockTitle>
      </div>
      <BlockContentWrap className="line-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={VISITORS_DATA}
            margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#f8f8f9"
              horizontal
              vertical={false}
              strokeDasharray="3 0"
            />
            <XAxis
              dataKey="month"
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
      </BlockContentWrap>
    </VisitorsBlockWrap>
  );
};

export default VisitorsBlock;
