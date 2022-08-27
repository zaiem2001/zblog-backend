import mongoose from "mongoose";
import { UPDATE_PROFILE_LIMIT } from "../Constants/index.js";

export const isValidObjectId = (id: string): boolean => {
  return mongoose.isValidObjectId(id);
};

export const canUpdateProfile = (date: any, createdAt: any) => {
  if (date.toString() === createdAt.toString()) return true;

  const currentDate = new Date();

  const lastUpdatedAtDate = new Date(date).setHours(
    new Date(date).getHours() + UPDATE_PROFILE_LIMIT
  );

  return lastUpdatedAtDate < Date.parse(currentDate.toDateString());
};
