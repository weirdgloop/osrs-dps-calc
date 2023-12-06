import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {IconPlus, IconTrash} from "@tabler/icons-react";

export const LoadoutActionButtons: React.FC = observer(() => {
  const store = useStore();
  const {selectedLoadout, createLoadout, deleteLoadout, canCreateLoadout, canRemoveLoadout} = store;

  return (
    <div className={'flex gap-0.5 text-body-200 dark:text-dark-100 mr-4'}>
      <button
        disabled={!canCreateLoadout}
        onClick={() => createLoadout(true, selectedLoadout)}
        className={'disabled:cursor-not-allowed disabled:text-btns-100 dark:disabled:text-dark-500 hover:text-green transition-colors'}
        data-tooltip-id={'tooltip'}
        data-tooltip-content={'Add new loadout'}
      >
        <IconPlus aria-label={'Add new loadout'}/>
      </button>
      {/*<button*/}
      {/*    disabled={!canCreateLoadout}*/}
      {/*    onClick={() => createLoadout(true, selectedLoadout)}*/}
      {/*    className={'disabled:cursor-not-allowed disabled:text-btns-100 hover:text-orange transition-colors'}*/}
      {/*    data-tooltip-id={'tooltip'}*/}
      {/*    data-tooltip-content={'Clone loadout'}*/}
      {/*>*/}
      {/*    <IconClipboardCopy/>*/}
      {/*</button>*/}
      <button
        disabled={!canRemoveLoadout}
        onClick={() => deleteLoadout(selectedLoadout)}
        className={'disabled:cursor-not-allowed disabled:text-btns-100 dark:disabled:text-dark-500 hover:text-red transition-colors'}
        data-tooltip-id={'tooltip'}
        data-tooltip-content={'Remove loadout'}
      >
        <IconTrash aria-label={'Remove loadout'}/>
      </button>
    </div>
  )
})
