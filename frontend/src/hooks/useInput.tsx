import { useState, useCallback } from 'react';

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  return { value, setValue, onChange };
};
