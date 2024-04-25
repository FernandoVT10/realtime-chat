/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { User } from "./User";
import { MESSAGE_CONFIG } from "shared/constants";

export interface Message extends Base {}

export class Message extends TimeStamps {
  @prop({ required: true, maxlength: MESSAGE_CONFIG.contentMaxLength })
  public content!: string;

  @prop({ required: true, ref: () => User })
  public createdBy!: Ref<User>;

  @prop({ required: true, ref: () => User })
  public sentTo!: Ref<User>;

  @prop({ default: false })
  public hasBeenRead!: boolean;
}

const MessageModel = getModelForClass(Message);

export default MessageModel;
