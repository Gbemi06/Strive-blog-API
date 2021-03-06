import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: { value: { type: Number }, unit: { type: String } },

    author: [{ type: Schema.Types.ObjectId, ref: "Authors" }],
    content: { type: String, required: true },
    comments: [{ name: String, comment: String, entryDate: Date }],
  },
  { timestamps: true }
);

export default model("Blog", blogSchema);
