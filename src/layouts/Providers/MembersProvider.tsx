import { MembersContext } from "@contexts/MembersContext";
import { ErrorDisplay } from "@layouts/components/ErrorDisplay";
import { MembersCollectionReference } from "@models/DB/MembersCollection.model";
import { Skeleton } from "@mui/material";
import { ReactNode } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export function MembersProvider({ children, membersRef }: { children: ReactNode, membersRef: MembersCollectionReference | undefined }) {
	// Hooks
	const [collectionData, collectionLoading, collectionError /*, _ */] = useCollectionData(membersRef);

	if (collectionError) return <ErrorDisplay error={collectionError} />;
	return collectionLoading
		? <Skeleton />
		: <MembersContext.Provider value={collectionData}>{children}</MembersContext.Provider>
};