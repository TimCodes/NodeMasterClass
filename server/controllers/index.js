import { Router } from "express";
import bootcamps from "./bootcamps";

export default ({ config, db }) => {
  let api = Router();

  // mount the bootcamps resource
  api.use("/bootcamps", bootcamps({ config, db }));

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version: "v1" });
  });

  return api;
};
