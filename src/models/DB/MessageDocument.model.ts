import { MessageModel } from "@models/App/Message.model";
import { WithFieldValueWithoutId } from "@mytypes/WithFieldValueWithoutId";

export type MessageDocument = WithFieldValueWithoutId<MessageModel>;
