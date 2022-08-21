import mongoose from "mongoose";
import { MONGO_URL } from "../environment.js";

export const connect = async (): Promise<void> => {
  await mongoose
    .connect(MONGO_URL!)
    .then(() => {
      console.log("connected to mongo.");
    })
    .catch((err: Error) => {
      console.log(err);
    });
};
