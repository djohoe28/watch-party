import { RoomModel } from "@models/App/Room.model";
import { WithFieldValueWithoutMetadata } from "@mytypes/WithFieldValueWithoutMetadata";
import { DocumentReference } from "firebase/firestore";

export type RoomDocument = WithFieldValueWithoutMetadata<RoomModel>;

export type RoomDocumentReference = DocumentReference<RoomModel, RoomDocument>;
