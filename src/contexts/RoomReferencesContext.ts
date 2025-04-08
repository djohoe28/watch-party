import { createContext } from "react";
import { RoomReferences } from "../hooks/useRoomReferences";

export const RoomReferencesContext = createContext<RoomReferences | null>(null); // LINT: undefined?
