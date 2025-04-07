import { createContext, ReactNode } from "react";
import MemberModel from "../models/Member.model";
import { MembersCollectionReference } from "../models/Firestore/MembersCollection.model";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Alert, Skeleton } from "@mui/material";

export const MembersContext = createContext<MemberModel[] | null | undefined>(null); // LINT: undefined?

export const MembersContextProvider = ({ children, membersRef }: { children: ReactNode, membersRef: MembersCollectionReference | null | undefined }) => {
	const [collectionData, collectionLoading, collectionError, _] = useCollectionData(membersRef);
	
	if (collectionError) return <Alert severity="error">{collectionError.toString()}</Alert>;
	return collectionLoading
		? <Skeleton />
		: <MembersContext.Provider value={collectionData}>{children}</MembersContext.Provider>
};