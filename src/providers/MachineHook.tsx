import { useContext } from "react";
import { AppContext } from "./MachineConntext";



export const useMachines = () => {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return ctx;
};