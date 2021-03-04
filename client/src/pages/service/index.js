import React from "react";
import ServiceList from "./ServiceList";
import { ServiceProvider } from "../../context/ServiceContext";

export default function Services() {
  return (
    <ServiceProvider>
      <ServiceList />
    </ServiceProvider>
  );
}
