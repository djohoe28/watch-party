import { createContext, ReactNode, useState } from "react";

export const UserIdContext = createContext<string>("UserIDGoesHere");

export const UserIdContextProvider = ({ children }: { children: ReactNode }) => {
	// TODO: https://firebase.google.com/docs/auth/web/anonymous-auth
	const [userId, setUserId] = useState<string>("UserIDGoesHere");
	return <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
}