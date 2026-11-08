import { useEffect, useState } from "react";

function readValue(key, initialValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? initialValue : JSON.parse(stored);
  } catch {
    return initialValue;
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }, [key, value]);

  return [value, setValue];
}
