import { useCallback, useState } from "react";

export interface ToggleListApi {
  values: boolean[];
  isOn: (index: number) => boolean;
  set: (index: number, value: boolean) => void;
}

/** Manages an independent on/off state per item (SIM cards, channels, ...). */
export function useToggleList(length: number, initial = true): ToggleListApi {
  const [values, setValues] = useState<boolean[]>(() => Array.from({ length }, () => initial));

  const set = useCallback((index: number, value: boolean) => {
    setValues((prev) => prev.map((item, i) => (i === index ? value : item)));
  }, []);

  const isOn = useCallback((index: number) => values[index] ?? false, [values]);

  return { values, isOn, set };
}
