import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  {
    timestamps: true,
  }
);

authorsSchema.pre("save", async function (next) {
  const plainPW = this.password;

  if (this.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 11);
    this.password = hash;
  }
  next();
});

authorsSchema.methods.toJSON = function () {
  const authorObject = this.toObject();

  delete authorObject.password;
  delete authorObject.__v;

  return authorObject;
};

authorsSchema.static("checkCredentials", async function (email, plainPW) {
  const author = await this.findOne({ email });

  if (author) {
    const isMatch = await bcrypt.compare(plainPW, author.password);
    console.log(author.password);

    if (isMatch) {
      return author;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export default model("Authors", authorsSchema);
