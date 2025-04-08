import { Alert, Skeleton } from "@mui/material";
import { ReactNode } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { MembersContext } from "../../contexts/MembersContext";
import { MembersCollectionReference } from "../../models/Firestore/MembersCollection.model";

export function MembersProvider({ children, membersRef }: { children: ReactNode, membersRef: MembersCollectionReference | null | undefined }) {
	const [collectionData, collectionLoading, collectionError, _] = useCollectionData(membersRef);
	
	if (collectionError) return <Alert severity="error">{collectionError.toString()}</Alert>;
	return collectionLoading
		? <Skeleton />
		: <MembersContext.Provider value={collectionData}>{children}</MembersContext.Provider>
};