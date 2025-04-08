import { MemberModel } from "@models/Member.model";
import { createContext } from "react";

export const MembersContext = createContext<MemberModel[] | null | undefined>(
	null
); // LINT: undefined?
