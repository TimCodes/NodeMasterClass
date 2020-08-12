import resource from "resource-router-middleware";
import Course from "../models/Course";
import Bootcamp from "../models/Bootcamp";

export default ({ config, db }) =>
  resource({
    /** Property name to store preloaded entity on `request`. */
    id: "Course",

    /** For requests with an `id`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[id] = data`.
     */
    async load(req, id, callback, next) {
      try {
        const course = await Course.findById(id),
          err = course ? null : "Not found";
        callback(err, course);
      } catch (error) {
        req.next(error);
      }
    },
    /** GET / - List all entities */
    async index({ params }, res, next) {
      getCourses({ params }, res, next);
    },

    /** POST / - Create a new entity */
    async create({ body }, res, next) {
      try {
        const course = await Course.create(body);
        res.status(201).json({
          succeess: true,
          data: Course,
        });
      } catch (error) {
        next(error);
      }
    },

    /** GET /:id - Return a given entity */
    async read({ Course }, res) {
      res.json(Course);
    },

    /** PUT /:id - Update a given entity */
    async update({ Course, body }, res) {
      for (let key in body) {
        if (key !== "id") {
          Course[key] = body[key];
        }
      }
      res.sendStatus(204);
    },

    /** DELETE /:id - Delete a given entity */
    async delete({ Course }, res) {
      Courses.splice(Courses.indexOf(Course), 1);
      res.sendStatus(204);
    },
  });

async function getCourses({ params }, res, next) {
  let { bootcampId } = params;
  try {
    let mongooseQuery;

    if (bootcampId) {
      mongooseQuery = Course.find({ bootcamp: bootcampId });
    } else {
      mongooseQuery = Course.find();
    }
    const coures = await mongooseQuery;
    res.status(200).json({ data: coures });
  } catch (error) {
    next(error);
  }
}

export { getCourses };
