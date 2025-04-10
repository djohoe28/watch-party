import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { useMemberSettings } from "@hooks/useMemberSettings";
import { Skeleton, Stack, Typography, Grid, Button, CircularProgress } from "@mui/material";
import { stringToColor } from "@utils/String.utils";
import { useContext, useMemo } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { ErrorDisplay } from "@components/Utilities/ErrorDisplay";
import { MemberFormControl } from "./MemberFormControl";
import { SubmitButton } from "@components/Utilities/SubmitButton";

export function MemberForm() {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const roomMember = useMemo(() => roomRefsContext?.member, [roomRefsContext?.member]);
	// Hooks
	// LINT: Leverage loading, error?
	const [documentData, documentLoading, documentError] = useDocumentData(roomMember);
	// FIXME: Use memo to have hooks update when memberRoomContext loads?
	const { sendMemberSettings, sending: hookSending, loading: hookLoading, error: hookError } = useMemberSettings(roomMember);
	// Memos (Default Values)
	const defaultName = useMemo(() => "", []); // TODO: Leverage `DEFAULT_NAME` (see String.utils.ts)
	const defaultColor = useMemo(() => documentData ? stringToColor(documentData.id) : "", [documentData?.id]);
	// FEATURE: Profile Image?

	// TODO: Error order? Return both?
	if (documentError) return <ErrorDisplay error={documentError} />;
	if (hookError) return <ErrorDisplay error={hookError} />;
	return (documentLoading || hookLoading) ? <Skeleton /> : <Stack
		component="form"
		spacing={2}
		action={(formData) => sendMemberSettings(Object.fromEntries(formData.entries()), false)}
		onReset={(event) => { console.log(event); sendMemberSettings({}, false); }}
		sx={{ p: 2 }}
	>
		<Typography variant="h6" component="h3" sx={{ mb: 2 }}>
			Member Settings
		</Typography>
		<Typography variant="body2" component="p" sx={{ mb: 2 }}>
			ID: {documentData?.id || "N/A"}
		</Typography>
		<MemberFormControl
			fieldName="name"
			inputType="text"
			defaultValue={defaultName}
			documentValue={documentData?.name}
			sendMemberSettings={sendMemberSettings}
		/>
		<MemberFormControl
			fieldName="color"
			inputType="color"
			defaultValue={defaultColor}
			documentValue={documentData?.color}
			sendMemberSettings={sendMemberSettings}
		/>
		<Grid container textAlign='center'>
			<Grid size='grow'>
				<Button type='reset'>Reset</Button>
			</Grid>
			<Grid size='grow'>
				{
					// NOTE: Grid forces same size whether CircularProgress or Button => alignItems='center' without breaking color input.
					hookSending
						? <CircularProgress />
						: <SubmitButton />
				}
			</Grid>
		</Grid>

	</Stack>
}