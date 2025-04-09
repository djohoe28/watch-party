import { DrawerWithToggle } from "@components/DrawerWithToggle";
import { Stack } from "@mui/material";
import { MemberForm } from "../Write/MemberForm";
import { MembersList } from "./MembersList";
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';

export function MemberControls() {
	return <Stack direction="row" spacing={2} textAlign='center' justifyContent="space-between">
		<DrawerWithToggle
			icon={<SettingsIcon />}
			tooltip="Member Settings"
			anchor="left"
			ariaLabel="Toggle Member Settings"
		>
			<MemberForm />
		</DrawerWithToggle>

		<DrawerWithToggle
			icon={<PeopleIcon />}
			tooltip="Members List"
			anchor="right"
			ariaLabel="Toggle Members List"
		>
			<MembersList />
		</DrawerWithToggle>
	</Stack>
}