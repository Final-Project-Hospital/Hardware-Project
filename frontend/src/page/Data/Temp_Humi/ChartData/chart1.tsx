import {
    Area,
    AreaChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
  } from "recharts";
  import { CustomerWrap } from "./Temp_Humi.styles";
  import { BlockContentWrap, BlockTitle } from "../../../../style/global/default";
  
  // กำหนด type ของข้อมูลแต่ละจุดในกราฟ
  interface CustomerDataType {
    month: string;
    last_month: number;
    this_month: number;
  }

  export const CUSTOMER_DATA = [
    {
      month: "Jan",
      last_month: 400,
      this_month: 240,
    },
    {
      month: "Feb",
      last_month: 300,
      this_month: 139,
    },
    {
      month: "Mar",
      last_month: 400,
      this_month: 180,
    },
    {
      month: "Apr",
      last_month: 278,
      this_month: 190,
      amt: 2000,
    },
    {
      month: "May",
      last_month: 189,
      this_month: 480,
    },
    {
      month: "Jun",
      last_month: 239,
      this_month: 380,
    },
    {
      month: "Jul",
      last_month: 349,
      this_month: 430,
    },
  ];
  
  const formatLegendValue = (value: string, entry: any) => {
    const initialVal = 0;
    const totalVal = CUSTOMER_DATA.reduce((accumulator: number, currentValue: CustomerDataType) => {
      if (Object.keys(currentValue).includes(entry.dataKey)) {
        return accumulator + (currentValue[entry.dataKey as keyof CustomerDataType] as number);
      }
      return accumulator;
    }, initialVal);
  
    return (
      <span className="custom-legend-item-text-group">
        <span className="custom-legend-item-text">{value.replace("_", " ")}</span>
        <span className="custom-legend-item-text">${totalVal}</span>
      </span>
    );
  };
  
  interface CustomTooltipProps extends TooltipProps<number, string> {}
  
  const CustomTooltipContent = ({ payload }: CustomTooltipProps) => {
    if (!payload || !payload.length) return null;
  
    return (
      <div className="custom-recharts-tooltip">
        <p className="recharts-tooltip-label">{payload[0].payload?.month}</p>
        <ul className="recharts-tooltip-item-list">
          {payload.map((item, index) => (
            <li key={index}>
              {formatTooltipValue(item.name || "", item.value || 0)}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const formatTooltipValue = (value: string, name: number): string => {
    return `${value.replace("_", " ")}: ${name}`;
  };
  
  const Customer = () => {
    return (
      <CustomerWrap>
        <div className="block-head">
          <BlockTitle className="block-title">
            <h3>Tempreture AND Humidity</h3>
          </BlockTitle>
        </div>
        <BlockContentWrap className="area-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={730}
              height={290}
              data={CUSTOMER_DATA}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0095FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0095FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#07E098" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#07E098" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip content={<CustomTooltipContent />} />
              <Area
                type="monotone"
                dataKey="last_month"
                stroke="#0095FF"
                fillOpacity={1}
                fill="url(#colorUv)"
                strokeWidth={2}
                dot={{ stroke: "#0095FF", fill: "#0095FF" }}
              />
              <Legend formatter={formatLegendValue} />
              <Area
                type="monotone"
                dataKey="this_month"
                stroke="#07E098"
                fillOpacity={1}
                fill="url(#colorPv)"
                strokeWidth={2}
                dot={{ stroke: "#07E098", fill: "#07E098" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </BlockContentWrap>
      </CustomerWrap>
    );
  };
  
  export default Customer;
  