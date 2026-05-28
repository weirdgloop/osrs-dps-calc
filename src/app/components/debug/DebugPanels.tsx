import React from 'react';
import { observer } from 'mobx-react-lite';
import { useDebug } from '@/state/DebugStore';
import DebugCalcDetails from '@/app/components/debug/DebugCalcDetails';
import { usePlayer } from '@/state/LoadoutStore';
import { DetailEntry } from '@/lib/CalcDetails';
import { CalcState } from '@/types/Results';
import DebugItemIds from './DebugItemIds';

const DebugPanels: React.FC = observer(() => {
  const { isDebug } = useDebug();
  const { results } = usePlayer();
  if (!isDebug) {
    return null;
  }

  // ideally, these should be plumbed down to subcomponents but idc for a debug tool
  const details: DetailEntry[] = results.basic.state === CalcState.COMPLETE ? (results.basic.details ?? []) : [];
  const specDetails: DetailEntry[] = results.basic.state === CalcState.COMPLETE ? (results.basic.details ?? []) : [];
  const reverseDetails: DetailEntry[] = results.basic.state === CalcState.COMPLETE ? (results.basic.details ?? []) : [];

  return (
    <>
      <DebugItemIds />
      <DebugCalcDetails label="Calc Details" details={details} />
      <DebugCalcDetails label="Spec Details" details={specDetails} />
      <DebugCalcDetails label="Reverse Details" details={reverseDetails} />
    </>
  );
});

export default DebugPanels;
