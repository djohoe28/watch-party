import { MemberModel } from "@models/App/Member.model";
import { createContext } from "react";

export const MembersContext = createContext<MemberModel[] | undefined>(
	undefined
);
