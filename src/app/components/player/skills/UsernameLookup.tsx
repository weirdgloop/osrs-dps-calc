import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import { usePlayer } from '@/state/PlayerStore';
import { usePreferences } from '@/state/PreferencesStore';

const UsernameLookup: React.FC = observer(() => {
  const player = usePlayer();
  const preferences = usePreferences();
  const { username } = preferences;
  const [btnDisabled, setBtnDisabled] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  return (
    <>
      <input
        type="text"
        className="form-control rounded w-full mt-auto"
        placeholder="OSRS username"
        value={username}
        onChange={(e) => preferences.update({ username: e.currentTarget.value })}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            btn.current?.click();
          }
        }}
      />
      <button
        ref={btn}
        disabled={!username || btnDisabled}
        type="button"
        className="ml-1 text-sm btn"
        onClick={async () => {
          setBtnDisabled(true);
          try {
            await toast.promise(
              player.fetchSkills(username),
              {
                pending: 'Fetching player skills...',
                success: `Successfully fetched player skills for ${username}!`,
                error: 'Error fetching player skills',
              },
              { toastId: 'skills-fetch' },
            );
          } catch (e) {
            console.error(e);
          } finally {
            setBtnDisabled(false);
          }
        }}
      >
        Lookup
      </button>
    </>
  );
});

export default UsernameLookup;
