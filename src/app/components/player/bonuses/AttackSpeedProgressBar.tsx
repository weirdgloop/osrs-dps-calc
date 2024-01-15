import React, { useEffect, useState } from 'react';

interface AttackSpeedProgressBarProps {
  speed: number;
}

const AttackSpeedProgressBar: React.FC<AttackSpeedProgressBarProps> = (props) => {
  const { speed } = props;
  const [speedPerc, setSpeedPerc] = useState(0);

  useEffect(() => {
    // Calculate the % of the progress bar - 6.0 is the highest that will fill the bar on OSRS' own UI
    let perc = Math.round((speed / 6.0) * 100);
    if (perc > 100) perc = 100;
    setSpeedPerc(perc);
  }, [speed]);

  const determineSpeedBg = () => {
    if (speedPerc > 90) {
      return 'bg-red-300';
    } if (speedPerc > 50) {
      return 'bg-orange-300';
    } if (speedPerc > 35) {
      return 'bg-yellow-300';
    }
    return 'bg-green-300';
  };

  return (
    <>
      <div className="mt-2 w-full bg-body-500 rounded-full">
        <div
          className={`${determineSpeedBg()} transition-[width,background] text-xs font-medium text-black text-center p-0.5 leading-none rounded-full`}
          style={{ width: `${speedPerc}%` }}
        >
          {speed}
          s
        </div>
      </div>
      <div className="mt-1 mb-4 flex justify-between text-xs text-gray-500">
        <p>Fast</p>
        <p>Slow</p>
      </div>
    </>
  );
};

export default AttackSpeedProgressBar;
