import mongoose from "mongoose";

import Blog from "../../models/Blog.js";
import User from "../../models/User.js";
import { rejectIf } from "../../utils/ErrorHandler.js";
import { isValidObjectId } from "../../utils/helpers.js";
import { ErrorMessages } from "../../Constants/index.js";
import { ResolverFn } from "../../Constants/Interfaces.js";

interface CreateBlog {
  input: {
    title: string;
    description: string;
    categories: string[];
    image: string;
  };
}

export const createBlog = async (
  _parent: any,
  { input }: CreateBlog,
  context: any
) => {
  const { user } = context;
  const { title, description, categories, image } = input;

  rejectIf(!user, ErrorMessages.loggedIn);

  const newBlog = {
    categories,
    image,
    description,
    title,
    user: new mongoose.Types.ObjectId(user._id),
  };

  const savedBlog = await new Blog(newBlog).populate("user", "-password");
  await savedBlog.save();

  await User.findOneAndUpdate(
    { _id: user._id },
    {
      $push: { blogs: new mongoose.Types.ObjectId(savedBlog._id) },
    }
  );

  return savedBlog;
};

export const likeUnlikeBlog: ResolverFn<{ blogId: string }, any> = async (
  _parent,
  { blogId },
  { user }
) => {
  rejectIf(!user, ErrorMessages.loggedIn);
  rejectIf(!isValidObjectId(blogId), ErrorMessages.invalid);

  const userId = user._id.toString();

  const blog = await Blog.findOne({ _id: blogId });
  rejectIf(!blog, ErrorMessages.notFound);

  const alreadyLiked = blog?.likes.some((like) => like === userId);

  if (alreadyLiked) {
    await Blog.updateOne(
      { _id: blogId },
      {
        $pull: { likes: userId },
      }
    );
  } else {
    await Blog.updateOne(
      { _id: blogId },
      {
        $push: { likes: userId },
      }
    );
  }

  const updatedBlog = await Blog.findOne({ _id: blogId }).populate(
    "user",
    "-password"
  );

  return updatedBlog;
};

export const commentOnBlog: ResolverFn<
  { blogId: string; comment: string },
  any
> = async (_parent, { blogId, comment }, { user }) => {
  rejectIf(!user, ErrorMessages.loggedIn);
  rejectIf(!isValidObjectId(blogId), ErrorMessages.invalid);

  const commentObj = {
    comment,
    user: new mongoose.Types.ObjectId(user._id),
  };

  const updatedBlog = await Blog.findOneAndUpdate(
    { _id: blogId },
    {
      $push: { comments: commentObj },
    }
  ).populate("user", "-password");

  return updatedBlog;
};
