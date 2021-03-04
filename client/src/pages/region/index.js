import React from "react";
import RegionList from "./RegionList";
import { RegionProvider } from "../../context/RegionContext";

export default function Regions() {
  return (
    <RegionProvider>
      <RegionList />
    </RegionProvider>
  );
}
