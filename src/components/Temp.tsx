import { useContext } from "react";
import UserContext, { UserContextProvider } from "../contexts/UserContext";

const Internal = () => {
	const user = useContext(UserContext);
	return <>{user.payload?.uid}</>
}

export const Temp = () => {
	return (
		<UserContextProvider>
			<Internal />
		</UserContextProvider>
	);
}