import { Stack, InputLabel, TextField, Input, Tooltip, IconButton } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";

interface MemberFormControlProps {
	label: string;
	value: string;
	placeholder?: string;
	type?: "text" | "color";
	isChanged: boolean;
	onChange: (value: string) => void;
	onReset: () => void;
}

export function MemberFormControl({ label, value, placeholder, type = "text", isChanged, onChange, onReset }: MemberFormControlProps) {
	return (
		<Stack direction="row" spacing={2} alignItems="center">
			<InputLabel htmlFor={label.toLowerCase()}>{label}{isChanged ? "*" : ""}</InputLabel>
			{type === "color" ? (
				<Input
					sx={{ flexGrow: 1 }}
					name={label}
					type="color"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			) : (
				<TextField
					name={label}
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			)}
			<Tooltip title={`Restore ${label}`}>
				<span>
					{/** MUI: You are providing a disabled `button` child to the Tooltip component.
A disabled element does not fire events.
Tooltip needs to listen to the child element's events to display the title. */}
					<IconButton
						onClick={onReset}
						aria-label={`Restore ${label}`}
						disabled={!isChanged}
					>
						<RestoreIcon />
					</IconButton>
				</span>
			</Tooltip>
		</Stack>
	);
};