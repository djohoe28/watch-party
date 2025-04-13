import { RoomModel } from "@models/App/Room.model";
import { createContext } from "react";

export const RoomDataContext = createContext<RoomModel | undefined>(undefined);
