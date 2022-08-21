import User from "../../models/User.js";
import { ResolverFn } from "../../Constants/Interfaces.js";
import { rejectIf } from "../../utils/ErrorHandler.js";
import { ErrorMessages } from "../../Constants/index.js";
import { isValidObjectId } from "../../utils/helpers.js";

export const getAllUsers: ResolverFn<any, any> = async (_parent) =>
  await User.find({});

export const getSingleUser: ResolverFn<{ id: string }, any> = async (
  _parent,
  { id }
) => {
  rejectIf(!isValidObjectId(id), ErrorMessages.invalid);

  const foundUser = await User.findById(id);

  rejectIf(!foundUser, ErrorMessages.invalid);

  return foundUser;
};
