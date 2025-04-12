import { AsyncContext, ErrorType } from "@mytypes/AsyncContext";
import { auth } from "@services/Auth.service";
import { User, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuthState(): AsyncContext<User> {
	// States
	const [user, setUser] = useState<User | undefined>(undefined); // LINT: undefined?
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(undefined);
	// Effects
	useEffect(() => {
		// NOTE: Using `onAuthStateChanged` instead of hard-coding `signInAnonymously` to allow future expansion.
		// FEATURE: Append user as member to database if new user.
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user === null) {
				signInAnonymously(auth)
					.then((credential) => {
						setLoading(false);
						setUser(credential.user);
					})
					.catch((err: unknown) => {
						setError(err);
					});
				return;
			}
			setUser(user);
			setLoading(false);
		});
		return unsubscribe;
	}, []);
	return { payload: user, loading, error };
}
