import express from "express";
import createError from "http-errors";
import blogModel from "./model.js";

const blogRouter = express.Router();

blogRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new blogModel(req.body);

    const { _id } = await newBlogPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
    const blogPost = await blogModel.find();
    res.send(blogPost);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogPost = await blogModel.findById(req.params.blogId);

    if (blogPost) {
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
      res.send(deletedBlog);
    } else {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/:blogId/comments", async (req, res, next) => {
  try {
    const comments = await blogModel.findById(req.body.blogId, {
      _id: 0,
    });

    if (comments) {
      const addComment = {
        ...comments.toObject(),
        entryDate: new Date(),
      };
      console.log("BOOK TO INSERT ", addComment);

      const newBlog = await blogModel.findByIdAndUpdate(
        req.params.blogId,
        { $push: { comment: addComment } },
        { new: true, runValidators: true }
      );
      if (newBlog) {
        res.send(newBlog);
      } else {
        next(createError(404, `User with id ${req.params.blogId} not found!`));
      }
    } else {
      next(createError(404, `Book with id ${req.body.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blogPost = await blogModel.findById(req.params.blogId);
    if (blogPost) {
      res.send(blogPost.comments);
    } else {
      next(createError(404, `comments for id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blogPost = await blogModel.findById(req.params.blogId);
    if (blogPost) {
      const comments = blogPost.comments.find(
        (comment) => comment._id.toString() === req.params.commentId
      );
      if (comments) {
        res.send(comments);
      } else {
        next(
          createError(404, `comment with id ${req.params.commentId} not found`)
        );
      }
    } else {
      next(
        createError(404, `Blog Post for id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
