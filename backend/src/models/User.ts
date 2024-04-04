/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { USER_CONFIG } from "shared/constants";

export interface User extends Base {}

export class User extends TimeStamps {
  @prop({ required: true, maxlength: USER_CONFIG.usernameMaxLength })
  public username!: string;

  @prop({ required: true, select: false })
  public password!: string;

  @prop()
  public avatar?: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
