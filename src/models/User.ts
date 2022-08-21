import mongoose from "mongoose";

interface UserModel {
  username: string;
  email: string;
  password: string;
  profilePicture: string;

  blogs: string;
  isAdmin: string;

  createdAt?: Date;
  updatedAt: string;
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },

  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  isAdmin: { type: Boolean, default: false },

  createdAt: { type: Date },
  updatedAt: { type: String, default: "" },
});

const User = mongoose.model<UserModel>("User", UserSchema);

export default User;
