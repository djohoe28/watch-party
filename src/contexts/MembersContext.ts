import { createContext } from "react";
import MemberModel from "../models/Member.model";

export const MembersContext = createContext<MemberModel[] | null | undefined>(
	null
); // LINT: undefined?
