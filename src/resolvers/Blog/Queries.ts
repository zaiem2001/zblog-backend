import mongoose from "mongoose";
import { ErrorMessages } from "../../Constants/index.js";

import { ResolverFn } from "../../Constants/Interfaces.js";
import Blog from "../../models/Blog.js";
import { rejectIf } from "../../utils/ErrorHandler.js";

type SearchQueryType = {
  categories?: any | null;
};

export const getAllBlogs: ResolverFn<any, any> = async (
  _parent,
  { filter, sortBy }
) => {
  const searchQuery: SearchQueryType = {};

  const sortOrder = sortBy || { createdAt: -1 };

  if (filter.categories) {
    searchQuery.categories = { $in: filter.categories };
  }

  const blogs = await Blog.find({
    ...(filter.user ? { user: new mongoose.Types.ObjectId(filter.user) } : {}),
    ...searchQuery,
  })
    .populate("user", "-password")
    .sort(sortOrder);

  return blogs;
};

export const getSingleBlog: ResolverFn<{ id: string }, any> = async (
  _parent,
  { id }
) => {
  const blog = await Blog.findById(id).populate(
    "user comments.user",
    "-password"
  );

  rejectIf(!blog, ErrorMessages.notFound);

  return blog;
};
