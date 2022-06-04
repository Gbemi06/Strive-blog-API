import createError from "http-errors";
import atob from "atob";
import authorsModel from "../authors/model.js";

export const basicAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createError(401, "Provide Authorization"));
  } else {
    const base64Credentials = req.headers.authorization.split(" ")[1];
    const [email, password] = atob(base64Credentials).split(":");
    console.log(email, password);

    const author = await authorsModel.checkCredentials(email, password);
    console.log("line 14", author);
    if (author) {
      req.author = author;
      console.log(author);
      next();
    } else {
      next(createError(401, "credentials are wrong"));
    }
  }
};
