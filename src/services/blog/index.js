import express from "express";
import createError from "http-errors";
import blogModel from "./model.js";

const blogRouter = express.Router();

blogRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);

    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const user = await blogModel.findById(req.params.userId);

    if (user) {
      res.send(user);
    } else {
      next(createError(404, `blog with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.params.userId, // WHO
      req.body, // HOW
      { new: true, runValidators: true }
    );

    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(createError(404, `Blog with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(req.params.userId);
    if (deletedBlog) {
      res.status(204).send();
    } else {
      next(createError(404, `Blog with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
