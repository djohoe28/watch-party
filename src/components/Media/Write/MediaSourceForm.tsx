import { Box, Stack, Typography } from "@mui/material";

// LINT: Find a better way to style the modal.
const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
  };

export function MediaSourceForm() {
	// TODO: IMPLEMENT THIS.
	// Contexts
	// Memos (Derived Contexts)
	// Hooks

	return <Stack
		component="form"
		spacing={2}
		action={(formData) => console.log(formData)}
		onReset={(event) => console.log(event)}
		sx={{ p: 2 }}
	>
		<Box sx={style}>
			<Typography id="modal-modal-title" variant="h6" component="h2">
				Text in a modal
			</Typography>
			<Typography id="modal-modal-description" sx={{ mt: 2 }}>
				Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
			</Typography>
		</Box>
	</Stack>;
}