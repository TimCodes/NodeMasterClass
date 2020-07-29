import resource from "resource-router-middleware";
import Bootcamp from "../models/bootcamps";
import { model } from "mongoose";
export default ({ config, db }) =>
  resource({
    /** Property name to store preloaded entity on `request`. */
    id: "bootcamp",

    /** For requests with an `id`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[id] = data`.
     */
    async load(req, id, callback, next) {
      console.log("laod ");
      console.log("id ", id);
      //console.log(arguments);
      console.log(req.next);

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
    async create({ body }, res) {
      try {
        const bootcamp = await Bootcamp.create(body);
        res.status(201).json({
          succeess: true,
          data: bootcamp,
        });
      } catch (error) {
        res.status(400).json({ succeess: false, message: error });
      }
    },

    /** GET /:id - Return a given entity */
    async read({ bootcamp, id }, res, next) {
      console.log("id", id);
      try {
        res.json({ success: true, data: bootcamp });
      } catch (error) {
        next(error);
        res.status(400).json({ succeess: false, message: error });
      }
    },

    /** PUT /:id - Update a given entity */
    async update({ bootcamp, body, id }, res) {
      console.log(bootcamp.id);
      console.log(id);
      Bootcamp.de;
      try {
        const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
          bootcamp.id,
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        console.log(updatedBootcamp);
        res.json({ success: true, data: updatedBootcamp });
      } catch (error) {
        res.status(400).json({ succeess: false, message: error });
      }
    },

    /** DELETE /:id - Delete a given entity */
    async delete({ bootcamp }, res) {
      try {
        await Bootcamp.deleteOne({ _id: bootcamp.id });
        res.status(204).json({ succeess: true, data: {} });
      } catch (error) {
        res.status(400).json({ succeess: false, message: error });
      }
    },
  });
