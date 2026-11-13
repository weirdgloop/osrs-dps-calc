import { Context, useContext } from 'react';

export default function useRequiredContext<T>(context: Context<T | null>, hookName: string): T {
  const value = useContext(context);
  if (value === null) {
    throw new Error(`${hookName} must be used within its store provider`);
  }
  return value;
}
