import { createContext, ReactNode } from "react";
import MemberModel from "../models/Member.model";
import { MembersCollectionReference } from "../models/Firestore/MembersCollection.model";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const MembersContext = createContext<MemberModel[] | null | undefined>(null); // LINT: undefined?

export const MembersContextProvider = ({ children, membersRef }: { children: ReactNode, membersRef: MembersCollectionReference | null | undefined }) => {
	const [collectionData, collectionLoading, collectionError, _] = useCollectionData(membersRef);
	// LINT: Leverage loading, error?
	return <MembersContext.Provider value={collectionData}>{children}</MembersContext.Provider>
};