import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env " });

const app = express();
const port = process.env.PORT || 5001;
app.listen(
  process.env.PORT,
  console.log(
    `server is runnins g at env:  ${process.env.NODE_ENV} Port: ${process.env.PORT}`
  )
);
