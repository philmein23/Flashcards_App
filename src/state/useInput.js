import { useState } from "react";

export function useInputValue(initialValue) {
  let [value, setState] = useState(initialValue);

  function onChange(event) {
    setState(event.target.value);
  }

  return {
    value,
    setState,
    onChange
  };
}
