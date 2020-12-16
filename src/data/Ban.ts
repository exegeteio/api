import { Document, model, Model, Schema } from "mongoose";

export interface IBan extends Document {
  twitch_id: string;
  twitch_name: string;
  channel: string;
  reason: string;
  expires_at: string;
}

const BanSchema: Schema = new Schema({
  twitch_id: { type: String, required: true, unique: true },
  twitch_name: { type: String, required: true },
  channel: { type: String, required: true },
  reason: { type: String, required: true },
  expires_at: { type: String, required: true },
});

const Ban: Model<IBan> = model("Ban", BanSchema);
export default Ban;
