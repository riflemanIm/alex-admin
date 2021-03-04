import React from "react";
import PromoList from "./PromoList";
import { PromoProvider } from "../../context/PromoContext";

export default function Promos() {
  return (
    <PromoProvider>
      <PromoList />
    </PromoProvider>
  );
}
