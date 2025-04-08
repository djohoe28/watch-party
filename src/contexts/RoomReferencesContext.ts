import { RoomReferences } from "@hooks/useRoomReferences";
import { createContext } from "react";

export const RoomReferencesContext = createContext<RoomReferences | null>(null); // LINT: undefined?
