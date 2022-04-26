import express from "express";
import createError from "http-errors";
import blogModel from "./model.js";

const blogRouter = express.Router();

blogRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new blogsModel(req.body);

    const { _id } = await newBlogPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
    const blogPost = await blogPostModel.find();
    res.send(blogPost);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogPost = await blogModel.findById(req.params.userId);

    if (user) {
      res.send(blogPost);
    } else {
      next(createError(404, `blog with id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.params.blogId,
      req.body,
      { new: true }
    );

    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(req.params.blogId);
    if (deletedBlog) {
      res.status(204).send();
    } else {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
