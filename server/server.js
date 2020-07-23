import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";

import middleware from "./middleware";
import api from "./controllers";

dotenv.config({ path: "./config/config.env" });

const app = express();
const port = process.env.PORT || 5001;
const config = {};
const db = {};

// external middleware

// use only in development
app.use(morgan("combined"));
app.use(middleware({ config, db }));

// api router
app.use("/api", api({ config, db }));

app.listen(
  port,
  console.log(
    `server is runnins g at env:  ${process.env.NODE_ENV} Port: ${process.env.PORT}`
  )
);
