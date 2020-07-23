import { Router } from "express";
import logger from "./logger";

export default ({ config, db }) => {
  let routes = Router();

  // add middleware here

  return [logger];
};
