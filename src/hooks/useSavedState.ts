import { useState, useEffect } from "react";

export default function useSavedState<T>(
  key: string,
  initialValue: T | (() => T),
  json: boolean = true
) {
  // Get from localStorage then
  // parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === "undefined") {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      if (item) {
        if (json) {
          return JSON.parse(item) as T;
        }
        return JSON.parse(item).value as T;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
    }

    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Save to localStorage whenever the state changes
  useEffect(() => {
    try {
      if (json) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } else {
        window.localStorage.setItem(
          key,
          JSON.stringify({ value: storedValue })
        );
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [json, key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
