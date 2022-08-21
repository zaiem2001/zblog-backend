import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    categories: [{ type: String, default: [] }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

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

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
