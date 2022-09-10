import { ResolverFn } from "../../Constants/Interfaces.js";
import Blog from "../../models/Blog.js";
import { BLOG_DATA } from "../../Constants/seeder.js";
import { VERIFY_TOKEN } from "../../environment.js";
import { rejectIf } from "../../utils/ErrorHandler.js";
import User from "../../models/User.js";
import { ApolloError } from "apollo-server-express";

const USER_ID = ""; // my user id

const checkIfUserIsAuthentic = (
  inputToken: string,
  VERIFY_TOKEN: any,
  user: any
) => {
  const isValidToken = inputToken === VERIFY_TOKEN;
  const userIsAdmin = user && user?.isAdmin;

  return isValidToken && userIsAdmin;
};

const populateBlogDb = async () => {
  const updatedData = await Promise.all(
    BLOG_DATA.map(async (blog) => {
      const updatedBlog = {
        ...blog,
        user: USER_ID,
        likes: [USER_ID],
        comments: [],
      };

      await User.findOneAndUpdate(
        { _id: updatedBlog.user },
        { $push: { blogs: updatedBlog._id } }
      );

      return updatedBlog;
    })
  );

  await Blog.insertMany(updatedData);
};

export const populateBlogCollection: ResolverFn<
  { token: string },
  any
> = async (_parent, { token }, { user }) => {
  const isAuthenticatedUser = checkIfUserIsAuthentic(token, VERIFY_TOKEN, user);

  rejectIf(!isAuthenticatedUser, "Permission denied");

  return populateBlogDb()
    .then(() => {
      return "success";
    })
    .catch((err: Error) => {
      throw new ApolloError(err.message);
    });
};
