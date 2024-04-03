/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { User } from "./User";

export interface Friend extends Base {}

export class Friend extends TimeStamps {
  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;

  @prop({ required: true, ref: () => User })
  public friend!: Ref<User>;
}

const FriendModel = getModelForClass(Friend);

export default FriendModel;
