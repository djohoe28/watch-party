import { DrawerWithToggle } from "@layouts/components/DrawerWithToggle";
import { ModalWithButton } from "@layouts/components/ModalWithButton";
import { MediaSourceForm } from "@layouts/Media/Write/MediaSourceForm";
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SourceIcon from '@mui/icons-material/Source';
import { Stack } from "@mui/material";
import { MembersList } from "./Read/MembersList";
import { MemberForm } from "./Write/MemberForm";

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