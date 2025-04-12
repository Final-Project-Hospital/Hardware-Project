import React from 'react';

interface Props {
  value: number;       
  type?: string;       
}

const Index: React.FC<Props> = (props) => {
  const { value } = props;

  let barColor = 'bg-white'; 

  if (value >= 40 && value <= 60) {
    barColor = 'bg-blue-400'; 
  } else if ((value >= 30 && value < 40) || (value > 60 && value <= 70)) {
    barColor = 'bg-green-400'; 
  } else {
    barColor = 'bg-yellow-400'; 
  }

  const widthPercent = Math.min((value / 100) * 100, 100); 

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
