import { createContext } from "react";

const DEFAULT_ROOM_ID = "RoomIDGoesHere";
export const RoomIdContext = createContext<string>(DEFAULT_ROOM_ID);
// TODO: Enable undefined?

// TODO: Remove?
// export const RoomIdContextProvider = ({ children }: { children: ReactNode }) => {
// 	const ROOM_ID_REGEX = /\/room\/(.*)$/i; // TODO: Check if this is URL safe?
// 	const [roomId, setRoomId] = useState<string>(ROOM_ID_REGEX.exec(window.location.href)?.[0] || DEFAULT_ROOM_ID);
// 	return <RoomIdContext.Provider value={roomId}>{children}</RoomIdContext.Provider>
// };