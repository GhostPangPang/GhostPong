import { useState, useCallback } from 'react';

interface UseInputProps {
  initialValue: string;
  validationFunc?: (value: string) => { isValid: boolean; errorMessage: string };
}

export const useInput = ({ initialValue, validationFunc }: UseInputProps) => {
  const [value, setValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState('');

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (validationFunc) {
        const { isValid, errorMessage } = validationFunc(newValue);
        setErrorMessage(isValid ? '' : errorMessage);
      }
    },
    [validationFunc],
  );

  return { value, onChange, setValue, errorMessage };
};
