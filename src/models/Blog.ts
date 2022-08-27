import mongoose from "mongoose";

interface blogModel {
  title: string;
  description: string;
  image: string;
  categories: string[];
  deleted: boolean;
  comments: {}[];
  user: string;
  likes: string[];

  createdAt?: Date;
  updatedAt: string;
}

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    categories: [{ type: String, default: [] }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    deleted: { type: Boolean, default: false },

    likes: [{ type: String, default: [] }],
    comments: [
      {
        comment: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model<blogModel>("Blog", BlogSchema);

export default Blog;
