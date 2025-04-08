import { Stack, InputLabel, Input, Tooltip, IconButton, InputLabelTypeMap } from "@mui/material";
import { HTMLInputTypeAttribute, useCallback, useEffect, useMemo, useState } from "react";
import RestoreIcon from '@mui/icons-material/Restore';
import { MemberModel } from "@models/App/Member.model";

type FieldType = keyof Partial<Omit<MemberModel, "id">>

type FieldMap = {
	[key in FieldType]: HTMLInputTypeAttribute; // LINT: InputLabelTypeMap["props"]["children"] ?
}

// TODO: Leverage FIELD_MAP, or keep compartmentalized?
const FIELD_MAP: FieldMap = {
	name: "text",
	color: "color",
}

interface MemberFormControlProps<T> {
	fieldName: FieldType;
	inputType: HTMLInputTypeAttribute;
	documentValue?: T;
	defaultValue: T;
	sendMemberSettings: (settings: Partial<Omit<MemberModel, "id">>, merge?: boolean) => void;
}

export function MemberFormControl<T>({ documentValue, defaultValue, fieldName, inputType = FIELD_MAP[fieldName], sendMemberSettings }: MemberFormControlProps<T>) {
	// States
	const [value, setValue] = useState<T>(documentValue || defaultValue);
	// Memos
	const isChanged = useMemo(() => (documentValue || defaultValue) !== value, [documentValue, defaultValue, value]);
	const capitalizedName = useMemo(() => fieldName.charAt(0).toUpperCase() + fieldName.slice(1), [fieldName]);
	const tooltipText = useMemo(() => `Restore ${capitalizedName}`, [capitalizedName]);
	// Callbacks
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value as T); // TODO: Type assertion for value
	};
	const handleFieldReset = useCallback((send?: boolean) => {
		setValue(documentValue || defaultValue);
		if (send) sendMemberSettings({ [fieldName]: documentValue })
	}, [documentValue, defaultValue, sendMemberSettings]);
	const handleResetTrue = useCallback(() => handleFieldReset(true), [handleFieldReset]);
	// Effects
	useEffect(() => {
		// If data has been updated from the server, update local state to match (default if undefined).
		// TODO: Make sure this is correct.
		setValue(documentValue || defaultValue);
	}, [documentValue, defaultValue, setValue]);

	return <Stack direction="row" spacing={2} alignItems="center">
		<InputLabel htmlFor={fieldName}>{capitalizedName}{isChanged ? "*" : ""}</InputLabel>
		<Input
			sx={{ flexGrow: 1 }}
			name={fieldName}
			type={inputType}
			value={value}
			onChange={handleChange}
		/>
		<Tooltip title={tooltipText}>
			<span>
				{/** MUI: You are providing a disabled `button` child to the Tooltip component.
A disabled element does not fire events.
Tooltip needs to listen to the child element's events to display the title. */}
				<IconButton
					onClick={handleResetTrue}
					aria-label={tooltipText}
					disabled={!isChanged}
				>
					<RestoreIcon />
				</IconButton>
			</span>
		</Tooltip>
	</Stack>
}