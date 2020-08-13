import { Router } from "express";
import bootcamps from "./bootcamps";
import { getBootCampsInRadius } from "./bootcamps";
import courses from "./courses";
import { getCourses } from "./courses";
import { get } from "mongoose";

export default ({ config, db }) => {
  let api = Router();

  // mount the bootcamps resource
  api.use("/bootcamps", bootcamps({ config, db }));
  api.get("/bootcamps/radius/:zipcode/:distance", getBootCampsInRadius);

  // mount the Courses resource
  api.use("/courses", courses({ config, db }));
  api.get("/bootcamps/:bootcampId/courses", getCourses);

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version: "v1" });
  });

  return api;
};
