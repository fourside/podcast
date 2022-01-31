import React, { useState } from "react";
import type { ReactElement } from "react";
import { DiscFreeOfDevDevice } from "../df-dev-device";

interface Props {
  dfByDevices: DiscFreeOfDevDevice[];
}

export function Index(props: Props): ReactElement {
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
      {props.dfByDevices.map((device) => (
        <div key={device.name}>
          <div>{device.name}</div>
          <div>{prettyByte(device.availableBytes)}</div>
        </div>
      ))}
    </div>
  );
}

const k = 1024;
const decimals = 2;
const units = ["Bytes", "KB", "MB", "GB", "TB"];

function prettyByte(bytes: number): string {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, unitIndex)).toFixed(decimals))} ${units[unitIndex]}`;
}
