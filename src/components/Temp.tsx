import { useContext } from "react";
import AuthContext, { AuthContextProvider } from "../contexts/AuthContext";

const Internal = () => {
	const user = useContext(AuthContext);
	return <>{user.payload?.uid}</>
}

export const Temp = () => {
	return (
		<AuthContextProvider>
			<Internal />
		</AuthContextProvider>
	);
}