import React from 'react';
import { observer } from 'mobx-react-lite';
import DebugPanel from '@/app/components/results/debug/DebugPanel';
import DetailsTable from '@/app/components/results/debug/DetailsTable';
import EquipmentIdsTable from '@/app/components/results/debug/EquipmentIdsTable';
import { useCalc } from '@/state/CalcStore';
import { usePlayer } from '@/state/PlayerStore';
import { useUI } from '@/state/UIStore';

const DebugPanels: React.FC = observer(() => {
  const ui = useUI();
  const calc = useCalc();
  const player = usePlayer();

  if (!ui.debug) return null;

  const { basic, reverse } = calc.results.get(player.uuid) ?? {};
  const basicResult = basic?.status === 'success' ? basic.value : undefined;
  const reverseResult = reverse?.status === 'success' ? reverse.value : undefined;

  return (
    <>
      <DebugPanel title="[Debug] Item IDs">
        <EquipmentIdsTable />
      </DebugPanel>
      <DebugPanel title="[Debug] Calc Details" defaultIsOpen>
        <DetailsTable details={basicResult?.details ?? []} />
      </DebugPanel>
      <DebugPanel title="[Debug] Spec Details" defaultIsOpen={false}>
        <DetailsTable details={basicResult?.specDetails ?? []} />
      </DebugPanel>
      <DebugPanel title="[Debug] Reverse Details" defaultIsOpen={false}>
        <DetailsTable details={reverseResult?.npcDetails ?? []} />
      </DebugPanel>
    </>
  );
});

export default DebugPanels;
