import React, { useState } from "react";
import type { ReactElement } from "react";

export function Index(): ReactElement {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount((prev) => prev + 1);
  };
  return (
    <div>
      <h1>hello SSR and Hydration</h1>
      <div>
        <button onClick={handleClick}>click</button>
      </div>
      <div>count: {count}</div>
    </div>
  );
}
