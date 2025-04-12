import React from 'react';

interface Props {
  value: number;       
  type?: string;       
}

const Index: React.FC<Props> = (props) => {
  const barColor = props.value >= 20 && props.value <= 30 ? 'bg-yellow-400' : props.value >= 30 && props.value <= 38 ? 'bg-orange-400' : props.value > 38 ? 'bg-red-400' : 'bg-white-400';
  const widthPercent = (props.value / 100) * 100; 

  return (
    <div className="w-[150px] h-auto overflow-hidden rounded-md bg-[#f1f1f1]">
      <span
        className={`flex items-center h-[8px] ${barColor}`}
        style={{ width: `${widthPercent}%` }}
      ></span>
    </div>
  );
};

export default Index;
