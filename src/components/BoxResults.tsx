import React, {PropsWithChildren} from 'react';

interface StatDisplay {
  name: string;
}

const StatDisplay: React.FC<PropsWithChildren<StatDisplay>> = (props) => {
  const {name, children} = props;
  return (
    <div className={'flex gap-4'}>
      <div className={'basis-60'}>
        <h3 className={'font-semibold'}>{name}</h3>
      </div>
      <div className={'font-mono'}>
        {children}
      </div>
    </div>

  )
}

export default function BoxResults() {
  return (
    <div className={'my-4 bg-[#1a1b24] text-white rounded shadow'}>
      <div className={'px-6 py-4 border-b-green border-b rounded rounded-bl-none rounded-br-none'}>
        <h1 className={`font-mono text-xl tracking-tight font-bold`}>Result</h1>
      </div>
      <div className={'p-6'}>
        <StatDisplay name={'Max hit'}>
          <p>43</p>
        </StatDisplay>
        <StatDisplay name={'Accuracy'}>
          <p>82.75%</p>
        </StatDisplay>
        <StatDisplay name={'Damage per second (DPS)'}>
          <p>5.9304</p>
        </StatDisplay>
        <StatDisplay name={'Average time-to-kill (TTK)'}>
          <p>56.25 seconds</p>
        </StatDisplay>
        <StatDisplay name={'Average damage taken'}>
          <p>18.71</p>
        </StatDisplay>
      </div>
    </div>
  )
}