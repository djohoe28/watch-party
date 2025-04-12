import { RoomModel } from "@models/App/Room.model";
import { WithFieldValueWithoutId } from "@mytypes/WithFieldValueWithoutId";
import { DocumentReference } from "firebase/firestore";

export type RoomDocument = WithFieldValueWithoutId<RoomModel>;

export type RoomDocumentReference = DocumentReference<RoomModel, RoomDocument>;
