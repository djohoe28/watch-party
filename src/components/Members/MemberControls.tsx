import { DrawerWithToggle } from "@components/DrawerWithToggle";
import { MembersList } from "@components/Members/Read/MembersList";
import { MemberForm } from "@components/Members/Write/MemberForm";
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { Stack } from "@mui/material";

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
		<ModalWithButton
			icon={<SourceIcon />}
			tooltip="Media Source Settings"
			ariaLabel="Toggle Media Source Settings"
		>
			<MediaSourceForm />
		</ModalWithButton>
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