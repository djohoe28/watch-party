import { RoomReferences } from "@hooks/useRoomReferences";
import { createContext } from "react";

export const RoomReferencesContext = createContext<RoomReferences | undefined>(
	undefined
); // LINT: undefined?
