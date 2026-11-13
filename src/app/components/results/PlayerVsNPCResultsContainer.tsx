import React from 'react';
import AutoHeight from '@/app/components/generic/AutoHeight';
import HitDistribution from '@/app/components/results/HitDistribution';
import PlayerVsNPCResultsTable from '@/app/components/results/PlayerVsNPCResultsTable';
import ResultsExpandToggle from '@/app/components/results/playerVsNpc/ResultsExpandToggle';

const ResultsContainer: React.FC = () => (
  <div className="grow basis-1/4 md:mt-9 flex flex-col">
    <div
      className="sm:rounded shadow-lg bg-tile dark:bg-dark-300"
    >
      <div
        className="px-4 py-3.5 border-b-body-400 bg-body-100 dark:bg-dark-400 dark:border-b-dark-200 border-b md:rounded md:rounded-bl-none md:rounded-br-none flex justify-between items-center"
      >
        <h2 className="font-serif text-lg tracking-tight font-bold dark:text-white flex items-center gap-2">
          Results
        </h2>
      </div>
      <AutoHeight
        duration={200}
        height="auto"
      >
        <div className="overflow-x-auto max-w-[100vw]">
          <PlayerVsNPCResultsTable />
        </div>
      </AutoHeight>
      <ResultsExpandToggle />
    </div>
    <HitDistribution />
  </div>
);

export default ResultsContainer;
