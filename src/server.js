import express from "express";
import cors from "cors";
import listUrl from "express-list-endpoints";
import mongoose from "mongoose";

import blogRouter from "./services/blog/index.js";

const server = express();
const port = process.env.PORT || 4000;

server.use(cors());
server.use(express.json());

server.use("/blogPosts", blogRouter);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("connected to Mongo!");

  server.listen(port, () => {
    console.table(listUrl(server));
    console.log(`Server is running on port ${port}`);
  });
});
