import React from "react";
import AlexList from "./AlexList";
import { AlexProvider } from "../../context/AlexContext";

export default function Alexs() {
  return (
    <AlexProvider>
      <AlexList />
    </AlexProvider>
  );
}
