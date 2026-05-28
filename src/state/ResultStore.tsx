import React, { createContext, useContext, useMemo } from 'react';
import {
  autorun, IReactionDisposer, makeAutoObservable,
} from 'mobx';
import { BasicResult } from '@/types/Results';

export interface ResultsState {
  basicResults: Map<number, BasicResult>;
}

export class ResultsStore implements ResultsState {
  basicResults: Map<number, BasicResult> = new Map();

  #reactionDisposers: IReactionDisposer[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.#reactionDisposers.push(autorun(() => {

    }));
  }

  public shutDown() {
    this.#reactionDisposers.forEach((d) => d());
  }

  public updateBasicResults(newResults: Map<number, BasicResult>) {
    this.basicResults = newResults;
  }
}

const ResultsContext = createContext<ResultsStore>({} as ResultsStore);

export const ResultsProvider: React.FC<{ value: ResultsStore, children: React.ReactNode }> = ({ value, children }) => (
  <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>
);

export const DefaultResultsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useMemo(() => new ResultsStore(), []);
  return (
    <ResultsProvider value={state}>{children}</ResultsProvider>
  );
};

export const useResults = () => useContext(ResultsContext);
