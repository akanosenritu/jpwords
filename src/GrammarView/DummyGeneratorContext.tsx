import React from "react";

const defaultGenerator = (count: number, exclude: string[]) => {
  return new Array(count).fill("Dummy")
}

export const DummyGeneratorContext = React.createContext(defaultGenerator);