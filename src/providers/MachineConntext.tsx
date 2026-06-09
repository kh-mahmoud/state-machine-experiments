import { createContext } from "react";
import { firstMachine } from "../machines/firstMachine";
import type { ActorRefFrom } from "xstate";

type AppContextType = {
  userRef: ActorRefFrom<typeof firstMachine>;
};

export const AppContext = createContext<AppContextType | null>(null);