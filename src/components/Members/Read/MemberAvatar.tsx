import { MemberModel } from "@models/App/Member.model";
import { Avatar } from "@mui/material";
import { stringToColor, stringToInitials } from "@utils/String.utils";

export function MemberAvatar({ member }: { member: MemberModel }) {
	return <Avatar sx={{ bgcolor: member.color ?? (member.id ? stringToColor(member.id) : null) }}>
		{member.name ? stringToInitials(member.name) : null}
	</Avatar>;
}