import React from 'react';

interface Props {
  value: number;       
  type?: string;       
}

const Index: React.FC<Props> = (props) => {
  const barColor = props.type === 'success' ? 'bg-green-400' : 'bg-blue-500';
  const widthPercent = (props.value / 5) * 100; 

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
