import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { ErrorMessages, UPDATE_PROFILE_LIMIT } from "../../Constants/index.js";
import { ResolverFn } from "../../Constants/Interfaces.js";
// import Blog from "../../models/Blog.js";
import User from "../../models/User.js";
import { rejectIf } from "../../utils/ErrorHandler.js";
import { generateToken } from "../../utils/generateToken.js";
import { canUpdateProfile, isValidObjectId } from "../../utils/helpers.js";

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
  rejectIf(user!.deleted, ErrorMessages.deleted);

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
    deleted: false,
  });

  rejectIf(!currentUser, ErrorMessages.notFound);

  rejectIf(
    !canUpdateProfile(currentUser!.updatedAt, currentUser!.createdAt),
    `You can update your profile after ${UPDATE_PROFILE_LIMIT + 1} Hours!`
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
  }

  const updatedUser = await currentUser?.save();

  return updatedUser;
};

export const deleteUser: ResolverFn<{ id: string | undefined }, any> = async (
  _parent,
  { id },
  { user }
) => {
  const target = {
    id: id || user.id,
    adminAuth: !!id,
  };

  rejectIf(!user, ErrorMessages.loggedIn);
  rejectIf(!isValidObjectId(target.id), ErrorMessages.invalid);

  if (target.adminAuth) {
    rejectIf(!user.isAdmin, ErrorMessages.unAuthorized);
  }

  const deletedUser = await User.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(target.id),
    },
    {
      $set: { deleted: true },
    }
  );

  // await Blog.updateMany(
  //   {
  //     user: new mongoose.Types.ObjectId(target.id),
  //   },
  //   {
  //     $set: { deleted: true },
  //   }
  // );

  return deletedUser;
};

// https://firebasestorage.googleapis.com/v0/b/z-blog-369a2.appspot.com/o/images%2FLOGO.png?alt=media&token=649a5246-9aa2-4731-9cf9-cf1804bc21b4
