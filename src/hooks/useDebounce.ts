/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";

// Our hook
export default function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value, delay]
  );

  return [debouncedValue, setDebouncedValue];
}

// Our hook
export function useDifferentDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [instantValue, setInstantValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const valueSetter = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setValue = (newValue: any) => {
    setInstantValue(newValue);

    if (valueSetter.current) clearTimeout(valueSetter.current);

    valueSetter.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, delay);
  };

  return [instantValue, debouncedValue, setValue];
}
