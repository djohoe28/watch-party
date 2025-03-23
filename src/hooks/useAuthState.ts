import { User, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useState, useEffect } from "react";
import auth from "../services/Auth.service";
import { AsyncContext, ErrorType } from "../types/AsyncContext";

export const useAuthState = (): AsyncContext<User> => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	useEffect(() => {
		// NOTE: Using `onAuthStateChanged` instead of hard-coding `signInAnonymously` to allow future expansion.
		const unsubscribe = onAuthStateChanged(auth,
			(user) => {
				if (user === null) {
					signInAnonymously(auth).then((credential) => {
						setLoading(false);
						setUser(credential.user);
					}).catch((error) => setError(error));
					return;
				}
				setUser(user);
				setLoading(false);
			},
		);
		return unsubscribe;
	}, []);
	return { payload: user, loading, error };
}