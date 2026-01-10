import { useState, useCallback } from 'react';

export function useTabs(defaultValue = '7days') {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback((_, newValue) => {
    setValue(newValue);
  }, []);

  return { value, onChange };
}
