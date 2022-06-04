import express from "express";
import createError from "http-errors";
import blogModel from "./model.js";
import q2m from "query-to-mongo";
import { basicAuth } from "../auth/basic.js";

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

blogRouter.get("/", basicAuth, async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await blogModel.countDocuments(mongoQuery.criteria);

    const blogPost = await blogModel
      .find(mongoQuery.criteria, mongoQuery.options.fields)
      .sort(mongoQuery.options.sort)
      .limit(mongoQuery.options.limit || 10)
      .skip(mongoQuery.options.skip || 0)
      .populate({ path: "author", select: "firstName" });
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
    const comment = await blogModel.findById(req.params.blogId, {
      _id: 0,
    });
    console.log(comment);
    if (comment) {
      const addComment = {
        ...req.body,
        entryDate: new Date(),
      };
      console.log("comment object ", addComment);

      const newBlog = await blogModel.findByIdAndUpdate(
        req.params.blogId,
        { $push: { comments: addComment } },
        { new: true, runValidators: true }
      );
      if (newBlog) {
        res.send(newBlog);
      } else {
        next(createError(404, `not found!`));
      }
    } else {
      next(createError(404, `BlogPost with id ${req.body.blogId} not found!`));
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

blogRouter.put("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blogPost = await blogModel.findById(req.params.blogId);
    if (blogPost) {
      const commentIndex = blogPost.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );
      console.log(commentIndex);
      if (commentIndex !== -1) {
        blogPost.comments[commentIndex] = {
          ...blogPost.comments[commentIndex].toObject(),
          ...req.body,
          entryDate: new Date(),
        };
        await blogPost.save();
        res.send(blogPost);
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

blogRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const updatedComment = await blogModel.findByIdAndUpdate(
      req.params.blogId,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );
    if (updatedComment) {
      res.send(deletedComment);
    } else {
      next(
        createError(404, `comment with id ${req.params.commentId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
