/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { User } from "./User";

export interface FriendRequest extends Base {}

export class FriendRequest {
  @prop({ required: true, ref: () => User })
  public requestedByUser!: Ref<User>;

  @prop({ required: true, ref: () => User })
  public sentToUser!: Ref<User>;
}

const FriendRequestModel = getModelForClass(FriendRequest);

export default FriendRequestModel;
