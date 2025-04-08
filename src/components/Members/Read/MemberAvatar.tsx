import { Avatar } from "@mui/material";
import MemberModel from "../../../models/Member.model";
import { stringToColor, stringToInitials } from "../../../utils/String.utils";

export function MemberAvatar ({ member }: { member: MemberModel }) {
	return <Avatar sx={{ bgcolor: member.color ?? stringToColor(member.id) }}>
		{member.name ? stringToInitials(member.name) : null}
	</Avatar>;
}