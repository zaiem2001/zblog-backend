import Blog from "../models/Blog.js";
import User from "../models/User.js";

import { getAllBlogs, getSingleBlog } from "./Blog/Queries.js";
import { deleteUser, login, register, updateUser } from "./User/Mutations.js";
import {
  commentOnBlog,
  createBlog,
  deleteBlog,
  likeUnlikeBlog,
} from "./Blog/Mutations.js";
import { getAllUsers, getSingleUser } from "./User/Queries.js";

export const resolvers = {
  Query: {
    hello: () => "hello world!",

    users: getAllUsers,
    user: getSingleUser,

    blogs: getAllBlogs,
    blog: getSingleBlog,
  },

  Mutation: {
    register,
    login,
    update: updateUser,
    delete: deleteUser,

    createBlog,
    likeUnlikeBlog,
    commentOnBlog,
    deleteBlog,
  },

  User: {
    blogs: async (parent: any, _args: any) => {
      const { _id } = parent;

      return await Blog.find({ user: _id });
    },
  },

  Blog: {
    likes: async (parent: any) =>
      await User.find({ _id: { $in: parent.likes } }).select("-password"),

    comments: async (parent: any) => {
      const blog = await Blog.findOne({ _id: parent._id }).populate(
        "comments.user",
        "-password"
      );

      const blogComments = blog?.comments;

      return blogComments;
    },
  },
};
