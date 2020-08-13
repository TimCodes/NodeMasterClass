import resource from "resource-router-middleware";
import Course from "../models/Course";
import Bootcamp from "../models/Bootcamp";

export default ({ config, db }) =>
  resource({
    /** Property name to store preloaded entity on `request`. */
    id: "course",

    /** For requests with an `id`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[id] = data`.
     */
    async load(req, id, callback, next) {
      try {
        const course = await Course.findById(id),
          err = course ? null : "Not found";
        console.log(course);
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
    async read({ course }, res) {
      console.log("get single course", course);
      try {
        res.json({ success: true, data: course });
      } catch (error) {
        next(error);
      }
    },

    /** PUT /:id - Update a given entity */
    async update({ course, body }, res, next) {
      try {
        const updatedCourse = await Course.findByIdAndUpdate(course.id, body, {
          new: true,
          runValidators: true,
        });
        res.json({ success: true, data: updatedCourse });
      } catch (error) {
        next(error);
      }
    },

    /** DELETE /:id - Delete a given entity */
    async delete({ course }, res, next) {
      try {
        course.remove();
        res.status(204).json({ succeess: true, data: {} });
      } catch (error) {
        next();
      }
    },
  });

async function getCourses({ params }, res, next) {
  let { bootcampId } = params;
  try {
    let mongooseQuery;

    if (bootcampId) {
      mongooseQuery = Course.find({ bootcamp: bootcampId });
    } else {
      mongooseQuery = Course.find().populate({
        path: "bootcamp",
        select: "name description",
      });
    }
    const coures = await mongooseQuery;
    res.status(200).json({ data: coures });
  } catch (error) {
    next(error);
  }
}

export { getCourses };
