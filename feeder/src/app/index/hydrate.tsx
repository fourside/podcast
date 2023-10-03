import { hydrateRoot } from "react-dom/client";
import { Index } from "./page";

hydrateRoot(document.getElementById("root") as Element, <Index dfByDevices={deserializeData()} />);

function deserializeData() {
  const data = document.getElementById("__DATA__")?.textContent;
  if (data === null || data === undefined) {
    return;
  }
  return JSON.parse(data);
}
