import * as mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI, {
  authSource: "admin",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
