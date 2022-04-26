import express from "express";
import cors from "cors";
import listUrl from "express-list-endpoints";
import mongoose from "mongoose";
import blogRouter from "./services/blog/index.js";
import {
  badRequestError,
  errorHandler,
  notFoundError,
  unauthorizedError,
} from "./errorHandler.js";

const server = express();
const port = process.env.PORT || 4000;

server.use(cors());
server.use(express.json());

server.use("/blogPosts", blogRouter);

server.use(unauthorizedError);
server.use(badRequestError);
server.use(notFoundError);
server.use(errorHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("connected to Mongo!");

  server.listen(port, () => {
    console.table(listUrl(server));
    console.log(`Server is running on port ${port}`);
  });
});
