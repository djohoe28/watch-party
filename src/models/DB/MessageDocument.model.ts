import { MessageModel } from "@models/App/Message.model";
import { WithFieldValueWithoutMetadata } from "@mytypes/WithFieldValueWithoutMetadata";

export type MessageDocument = WithFieldValueWithoutMetadata<MessageModel>;
