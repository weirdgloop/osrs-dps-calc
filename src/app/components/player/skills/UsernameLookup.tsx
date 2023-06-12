import React, {useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import localforage from "localforage";

const UsernameLookup: React.FC = observer(() => {
  const store = useStore();
  const {username} = store.ui;
  const shouldRemember = store.prefs.rememberUsername;
  const [btnDisabled, setBtnDisabled] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  return (
    <>
      <input
        type={'text'}
        className={'form-control rounded w-full mt-auto'}
        placeholder={'RuneScape name'}
        value={username}
        onChange={(e) => {
          store.updateUIState({username: e.currentTarget.value});
          if (shouldRemember) {
            localforage.setItem('dps-calc-username', e.currentTarget.value).catch(() => {
            });
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            btn.current?.click();
          }
        }}
      />
      <button
        ref={btn}
        disabled={!username || btnDisabled}
        type={'button'}
        className={'ml-1 text-sm btn'}
        onClick={async () => {
          setBtnDisabled(true);
          await store.fetchCurrentPlayerSkills();
          setBtnDisabled(false);
        }}
      >
        Lookup
      </button>
    </>
  )
})

export default UsernameLookup;