import { DrawerWithToggle } from "@components/Utilities/DrawerWithToggle";
import { Stack } from "@mui/material";
import { MemberForm } from "../Write/MemberForm";
import { MembersList } from "./MembersList";
import { ModalWithButton } from "@components/Utilities/ModalWithButton";
import { MediaSourceForm } from "@components/Media/Write/MediaSourceForm";
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import SourceIcon from '@mui/icons-material/Source';

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