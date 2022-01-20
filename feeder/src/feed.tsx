import { ReactElement } from "react";

export function Feed(): ReactElement {
  const data = ["a", "b", "c"];
  return (
    <div>
      <h1>hello world</h1>
      <ul>
        {data.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
