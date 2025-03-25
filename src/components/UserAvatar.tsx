import { Avatar } from "@mui/material";
import UserModel from "../models/User.model";
import { stringToColor, stringToInitials } from "../utils/String.utils";

export default function UserAvatar({ user }: { user: UserModel }) {
	return <Avatar sx={{ bgcolor: user.color ?? stringToColor(user.id) }}>{stringToInitials(user.name)}</Avatar>;
}