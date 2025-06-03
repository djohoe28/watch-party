import { Alert } from "@mui/material";
import { ErrorType } from "@mytypes/ErrorType";

export function ErrorDisplay({ error }: { error: ErrorType }) {
	return <Alert severity="error">{error?.toString()}</Alert>;
}