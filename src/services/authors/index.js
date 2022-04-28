import express from "express";
import AuthorsModel from "./model.js";
import createError from "http-errors";

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const getAuthors = await AuthorsModel.find();
    res.send(getAuthors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const getOneAuthor = await AuthorsModel.findById(req.params.authorId);
    if (getOneAuthor) {
      res.send(getOneAuthor);
    } else {
      next(
        createError(
          404,
          `Author with id ${req.params.authorId} is not available`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const deleteAuthor = await AuthorsModel.findByIdAndDelete(
      req.params.authorId
    );
    if (deleteAuthor) {
      res.status(204).send();
    } else {
      next(
        createError(
          404,
          `Author with id ${req.params.authorId} is not available`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
