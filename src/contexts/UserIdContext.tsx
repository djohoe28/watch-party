import { createContext, ReactNode, useState } from "react";

export const UserIdContext = createContext<string>("UserIDGoesHere");

export const UserIdContextProvider = ({ children }: { children: ReactNode }) => {
	// TODO: https://firebase.google.com/docs/auth/web/anonymous-auth
	const [userId, setUserId] = useState<string>("UserIDGoesHere"); // TODO: Load from Memory?
	return <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
}