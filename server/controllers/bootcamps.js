import resource from "resource-router-middleware";
import Bootcamp from "../models/bootcamps";
console.log(" ------- processs env server -----------------");
console.log(Object.keys(process.env));
export default ({ config, db }) =>
  resource({
    /** Property name to store preloaded entity on `request`. */
    id: "bootcamp",

    /** For requests with an `id`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[id] = data`.
     */
    async load(req, id, callback, next) {
      try {
        const bootcamp = await Bootcamp.findById(id),
          err = bootcamp ? null : "Not found";
        callback(err, bootcamp);
      } catch (error) {
        req.next(error);
      }
    },

    /** GET / - List all entities */
    async index({ params }, res, next) {
      try {
        const bootcamps = await Bootcamp.find();
        res
          .status(200)
          .json({ succes: true, data: { count: bootcamps.length, bootcamps } });
      } catch (error) {
        res.status(400).json({ succeess: false, message: error });
      }
    },

    /** POST / - Create a new entity */
    // @desc Create New Bootcamp
    // @route Post/api/bootcamps
    // /api/v1/bootcamps
    async create({ body }, res, next) {
      try {
        const bootcamp = await Bootcamp.create(body);
        res.status(201).json({
          succeess: true,
          data: bootcamp,
        });
      } catch (error) {
        next(error);
      }
    },

    /** GET /:id - Return a given entity */
    async read({ bootcamp, id }, res, next) {
      try {
        res.json({ success: true, data: bootcamp });
      } catch (error) {
        next(error);
      }
    },

    /** PUT /:id - Update a given entity */
    async update({ bootcamp, body, id }, res, next) {
      try {
        const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
          bootcamp.id,
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        res.json({ success: true, data: updatedBootcamp });
      } catch (error) {
        next(error);
      }
    },

    /** DELETE /:id - Delete a given entity */
    async delete({ bootcamp }, res, next) {
      try {
        await Bootcamp.deleteOne({ _id: bootcamp.id });
        res.status(204).json({ succeess: true, data: {} });
      } catch (error) {
        next(error);
      }
    },
  });
