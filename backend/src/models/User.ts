/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { USER_CONFIG } from "shared/constants";

const AVATARS_URL = "http://localhost:3000/uploads/avatars";

export interface User extends Base {}

const completeAvatarURL = (avatar: string | undefined): string => {
  let avatarURL: string;

  if(avatar) {
    avatarURL = `${AVATARS_URL}/${avatar}`;
  } else {
    avatarURL = `${AVATARS_URL}/default.webp`;
  }

  return avatarURL;
};

@modelOptions({
  schemaOptions: {
    toJSON: { getters: true },
    id: false,
  },
})
export class User extends TimeStamps {
  @prop({ required: true, maxlength: USER_CONFIG.usernameMaxLength })
  public username!: string;

  @prop({ required: true, select: false })
  public password!: string;

  @prop({ get: completeAvatarURL })
  public avatar?: string;

  @prop({ default: false })
  public isOnline!: boolean;
}

const UserModel = getModelForClass(User);

export default UserModel;
