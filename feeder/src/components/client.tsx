import React from "react";
import { hydrate } from "react-dom";
import { Index } from ".";

hydrate(<Index dfByDevices={deserializeData()} />, document.getElementById("root"));

function deserializeData() {
  const data = document.getElementById("__DATA__")?.textContent;
  if (data === null || data === undefined) {
    return;
  }
  return JSON.parse(data);
}
