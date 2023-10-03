import { CSSProperties, FC } from "react";
import { DiscFreeOfDevDevice } from "./df-dev-device";

interface Props {
  dfByDevices: DiscFreeOfDevDevice[];
}

export const Devices: FC<Props> = (props) => {
  return (
    <div style={devicesStyle}>
      {props.dfByDevices.map((device) => (
        <div key={device.name}>
          <div>{device.name}</div>
          <div>{prettyByte(device.availableBytes)}</div>
        </div>
      ))}
    </div>
  );
};

const devicesStyle: CSSProperties = {
  display: "flex",
  gap: "16px",
};

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
