import { Fragment, useContext } from "react";
import { UsersContext } from "../contexts/UsersContext";
import AuthContext from "../contexts/AuthContext";
import { useRoomUserDocument } from "../hooks/useRoomUserDocument";

export default function UserSettings() {
	// Contexts
	const usersContext = useContext(UsersContext);
	const authContext = useContext(AuthContext);
	// Hooks
	const userRoomContext = useRoomUserDocument(usersContext, authContext);
	return <Fragment>
		ID: {userRoomContext.data?.id}<br />
		Name: {userRoomContext.data?.name}<br />
		Color: {userRoomContext.data?.color}
	</Fragment>
}