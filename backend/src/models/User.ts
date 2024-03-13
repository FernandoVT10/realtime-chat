/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";

export interface User extends Base {}

export class User extends TimeStamps {
  @prop({ required: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;

  @prop()
  public avatar?: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
