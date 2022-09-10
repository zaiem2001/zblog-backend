import mongoose from "mongoose";
import { ErrorMessages } from "../../Constants/index.js";

import { ResolverFn } from "../../Constants/Interfaces.js";
import Blog from "../../models/Blog.js";
import { rejectIf } from "../../utils/ErrorHandler.js";

type SearchQueryType = {
  categories?: any | null;
  deleted: boolean;
};

export const getAllBlogs: ResolverFn<any, any> = async (
  _parent,
  { filter, sortBy, after, first = 6 }
) => {
  const searchQuery: SearchQueryType = { deleted: false };

  const whereOptions = after
    ? {
        createdAt: { $lt: after },
      }
    : {};

  const sortOrder = sortBy || { createdAt: -1 };

  if (filter && filter.categories) {
    searchQuery.categories = { $in: filter.categories };
  }

  const blogs = await Blog.find({
    ...whereOptions,
    ...(filter?.user
      ? { user: new mongoose.Types.ObjectId(filter?.user) }
      : {}),
    ...searchQuery,
  })
    .limit(first + 1)
    .populate("user", "-password")
    .sort(sortOrder);

  const hasNextPage = blogs.length > first;
  const hasPreviousPage = false;

  if (hasNextPage) {
    blogs.pop();
  }

  return {
    totalCount: blogs.length,
    edges: blogs.map((blog) => ({
      cursor: blog.createdAt,
      node: blog,
    })),
    pageInfo: {
      startCursor: blogs[0] ? blogs[0].createdAt : null,
      endCursor: blogs[blogs.length - 1].createdAt,
      hasNextPage,
      hasPreviousPage,
    },
  };
};

export const getSingleBlog: ResolverFn<{ id: string }, any> = async (
  _parent,
  { id }
) => {
  const blog = await Blog.findOne({ _id: id, deleted: false }).populate(
    "user comments.user",
    "-password"
  );

  rejectIf(!blog, ErrorMessages.notFound);

  return blog;
};
