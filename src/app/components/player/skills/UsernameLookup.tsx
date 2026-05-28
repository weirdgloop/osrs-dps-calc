import React from 'react';
import { observer } from 'mobx-react-lite';
import { useUIState } from '@/state/UIStateStore';
import { usePlayer } from '../../../../state/LoadoutStore';

const UsernameLookup: React.FC = observer(() => {
  const { username, updateUIState } = useUIState();
  const { isLoadingPlayerSkills, loadPlayerSkills } = usePlayer();

  const onSubmit = () => {
    // noinspection JSIgnoredPromiseFromCall resolution is handled in loadPlayerSkills via toast
    loadPlayerSkills(username);
  };

  return (
    <>
      <input
        type="text"
        className="form-control rounded w-full mt-auto"
        placeholder="OSRS username"
        value={username}
        onChange={(e) => { updateUIState({ username: e.target.value }); }}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            onSubmit();
          }
        }}
      />
      <button
        disabled={!username || isLoadingPlayerSkills}
        type="button"
        className="ml-1 text-sm btn"
        onClick={() => onSubmit()}
      >
        Lookup
      </button>
    </>
  );
});

export default UsernameLookup;
