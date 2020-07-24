import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";

import middleware from "./middleware";
import api from "./controllers";
import connectDb from "./config/db";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
const config = {};
const db = {};

// connect to db
connectDb();

// external middleware here
app.use(morgan("combined"));

// use only in development
if (process.env.NODE_ENV === "development") {
  app.use(middleware({ config, db }));
}
// api router
app.use("/api", api({ config, db }));

const server = app.listen(
  port,
  console.log(
    `server is running in environment:  ${process.env.NODE_ENV} on Port: ${process.env.PORT}`
      .green.bold
  )
);

// Handle unhandled promise errors

process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandeled Error: ${error.message}`.red);
  //close server and exit process
  server.close(() => proccess.exit(1));
});
