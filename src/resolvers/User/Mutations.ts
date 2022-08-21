import bcrypt from "bcrypt";

import { ErrorMessages, UPDATE_PROFILE_LIMIT } from "../../Constants/index.js";
import { ResolverFn } from "../../Constants/Interfaces.js";
import User from "../../models/User.js";
import { rejectIf } from "../../utils/ErrorHandler.js";
import { generateToken } from "../../utils/generateToken.js";
import { canUpdateProfile } from "../../utils/helpers.js";

type RegisterInput = {
  input: {
    username: string;
    email: string;
    profilePicture?: string;
    password: string;
  };
};

type LoginInput = {
  email: string;
  password: string;
};

export const register: ResolverFn<RegisterInput, any> = async (
  _root,
  { input }
) => {
  const { username, email, password } = input;

  rejectIf(
    !username.trim() || !email.trim() || !password.trim(),
    ErrorMessages.invalid
  );

  const user = await User.findOne({ email });
  rejectIf(!!user, "User Already Exists.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const registeredUser = await new User({
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  }).save();

  return registeredUser;
};

export const login: ResolverFn<LoginInput, any> = async (
  _,
  { email, password }
) => {
  const user = await User.findOne({ email });
  rejectIf(!user, "Invalid Email or Password!");

  const isValidPassword = await bcrypt.compare(password, user!.password);
  rejectIf(!isValidPassword, "Invalid Email or Password!");

  const token = generateToken({ _id: user!._id.toString() });

  return {
    token,
    user,
  };
};

type UpdateUserArgs = {
  input: {
    username?: string;
    email?: string;
    profilePicture?: string;
  };
};

export const updateUser: ResolverFn<UpdateUserArgs, any> = async (
  _parent,
  { input },
  { user }
) => {
  rejectIf(!user, ErrorMessages.loggedIn);

  const currentUser = await User.findOne({
    _id: user._id,
  });

  rejectIf(!currentUser, ErrorMessages.notFound);

  rejectIf(
    !canUpdateProfile(currentUser!.updatedAt),
    `You can update your profile after ${UPDATE_PROFILE_LIMIT} Hours!`
  );

  const emailAlreadyExists = await User.findOne({ email: input.email });
  rejectIf(
    !!emailAlreadyExists && currentUser?.email !== emailAlreadyExists.email,
    "Email already in use."
  );

  const usernameAlreadyExists = await User.findOne({
    username: input.username,
  });
  rejectIf(
    !!usernameAlreadyExists &&
      currentUser?.username !== usernameAlreadyExists?.username,
    "Username already exists."
  );

  if (currentUser) {
    currentUser.email = input.email || currentUser?.email;
    currentUser.username = input.username || currentUser?.username;
    currentUser.profilePicture =
      input.profilePicture || currentUser?.profilePicture;

    currentUser.updatedAt = new Date().toString();
  }

  const updatedUser = await currentUser?.save();

  return updatedUser;
};
