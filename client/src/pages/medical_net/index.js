import React from "react";
import MedicalNetList from "./MedicalNetList";
import { MedicalNetProvider } from "../../context/MedicalNetContext";

export default function MedicalNets() {
  return (
    <MedicalNetProvider>
      <MedicalNetList />
    </MedicalNetProvider>
  );
}
