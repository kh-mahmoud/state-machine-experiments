import { useMachine } from "@xstate/react";
import { AppContext } from "./MachineConntext";
import { firstMachine } from "../machines/firstMachine";




export const MachineProvider = ({ children }: { children: React.ReactNode }) => {
  const [, , userRef] = useMachine(firstMachine);

  return (
    <AppContext.Provider value={{ userRef }}>
      {children}
    </AppContext.Provider>
  );
};