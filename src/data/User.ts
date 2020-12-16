import { Document, model, Model, Schema } from "mongoose";

export interface IUser extends Document {
  access_token: string;
  refresh_token: string;
  next_refresh: string;
  twitch_id: string;
  twitch_name: string;
}

const UserSchema: Schema = new Schema({
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  next_refresh: { type: String, required: true },
  twitch_id: { type: String, required: true, unique: true },
  twitch_name: { type: String, required: true },
});

const User: Model<IUser> = model("User", UserSchema);
export default User;
