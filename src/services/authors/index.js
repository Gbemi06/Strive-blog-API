import express from "express";
import AuthorsModel from "./model.js";
import createError from "http-errors";
// import { basicAuth } from "../auth/basic.js";
import { adminOnly } from "../auth/adminOnly.js";
import { JWTAuth } from "../auth/tokens.js";
import { generateAccessToken } from "../auth/tools.js";

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

// authorsRouter.get("/", basicAuth, async (req, res, next) => {
authorsRouter.get("/", JWTAuth, async (req, res, next) => {
  try {
    const getAuthors = await AuthorsModel.find();
    res.send(getAuthors);
  } catch (error) {
    next(error);
  }
});

// authorsRouter.get("/me", basicAuth, async (req, res, next) => {
authorsRouter.get("/me", JWTAuth, async (req, res, next) => {
  try {
    const getAuthor = await AuthorsModel.find();
    res.send(getAuthor);
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/me", JWTAuth, async (req, res, next) => {
  console.log(req.author);
  try {
    const updatedMe = await AuthorsModel.findByIdAndUpdate(
      req.author._id,
      req.body
    );
    console.log(updatedMe);

    if (updatedMe) {
      res.send(updatedMe);
    } else {
      next(createError(404, `Blog with id ${req.user._id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

/*authorsRouter.get(
  "/:authorId",
  basicAuth,
  adminOnly,
  async (req, res, next) => {*/
authorsRouter.get("/:authorId", JWTAuth, adminOnly, async (req, res, next) => {
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
    next(createError(404, "Admin endpoints Only"));
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorsModel.findByIdAndUpdate(
      req.params.authorId,
      req.body,
      { new: true }
    );

    if (updatedAuthor) {
      res.send(updatedAuthor);
    } else {
      next(createError(404, `Blog with id ${req.params.authorId} not found!`));
    }
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

authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const user = await AuthorsModel.checkCredentials(email, password);
    console.log(user);
    if (user) {
      const accessToken = await generateAccessToken({
        _id: user._id,
        role: user.role,
      });
      res.send({ accessToken });
    } else {
      // 4. If credentials are not ok --> throw an error (401)
      next(createError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
