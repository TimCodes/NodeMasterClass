import resource from "resource-router-middleware";
import Bootcamp from "../models/bootcamps";
import geocoder from "../utils/geocoder";

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

// custom route methods

const getBootCampsInRadius = async ({ params }, res, next) => {
  try {
    // get lat/long from geocoder
    const { zipcode, distance } = params;
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    console.log(zipcode, distance);
    console.log(loc);
    //calc radius using radians
    // divide dist by radius
    // Radius of earth = 3,963 miles
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    console.log(bootcamps);

    res.json({ success: true, data: bootcamps });
  } catch (error) {
    next(error);
  }
};

export { getBootCampsInRadius };
