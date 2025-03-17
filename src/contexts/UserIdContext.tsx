import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const UserIdContext = createContext<string | null>(null);

export const UserIdContextProvider = ({ children }: { children: ReactNode }) => {
	// TODO: https://firebase.google.com/docs/auth/web/anonymous-auth
	const [userId, setUserId] = useState<string | null>(null); // TODO: Load from Memory?
	// TODO: Should `loading` be exported?
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		setLoading(true);
		useAuth().then((credential) => {
			setUserId(credential.user.uid);
			setLoading(false);
		});
	}, [])
	return <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
}