import { Router } from "express";
import logger from "./logger";
import ErrorHandler from "./errorHandler";
export default ({ config, db }) => {
  let routes = Router();

  // add middleware here

  return [logger, ErrorHandler];
};
