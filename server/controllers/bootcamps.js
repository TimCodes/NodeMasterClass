import resource from "resource-router-middleware";
import Bootcamp from "../models/Bootcamp";
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
    async index({ params, query }, res, next) {
      const reqQuery = { ...query };
      // get query strings that are for
      // selecting and pagination, etc...
      const { select, sort, page, limit } = query;

      // Exclude these field
      const removeFields = ["select", "sort", "page", "limit"];
      removeFields.forEach((p) => delete reqQuery[p]);

      let queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => "$" + match
      );

      let mongooseQuery = Bootcamp.find(JSON.parse(queryStr)).populate(
        "courses"
      );

      // get only selected fields
      if (select) {
        const fields = select.split(",");
        mongooseQuery = mongooseQuery.select(fields);
      }

      // sorty documents
      if (sort) {
        const sortBy = sort.split(",").join(" ");
        mongooseQuery = mongooseQuery.sort(sortBy);
      } else {
        mongooseQuery = mongooseQuery.sort("-createdAt");
      }

      // pagination

      let pageNum = page ? parseInt(page, 10) : 0;
      let limitNum = limit ? parseInt(limit, 10) : 2;
      let startIdx = pageNum > 0 ? (pageNum - 1) * limitNum : 0;
      let endIdx = pageNum * limitNum;
      let total = await Bootcamp.countDocuments();

      //pagination result

      let pagination = {};
      if (endIdx < total) {
        pagination.next = {
          pageNum: pageNum + 1,
          limit: limitNum,
        };
      }

      if (startIdx > 0) {
        pagination.prev = {
          page: pageNum - 1,
          limit: limitNum,
        };
      }

      mongooseQuery = mongooseQuery.skip(startIdx).limit(limitNum);

      try {
        const bootcamps = await mongooseQuery;

        res.status(200).json({
          succes: true,
          data: { count: bootcamps.length, pagination, bootcamps },
        });
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
    async read({ bootcamp, id, query }, res, next) {
      console.log("get bootcam p");

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
        //const bootcamp = await Bootcamp.findById(bootcamp.id);
        console.log("delete bootcamp");

        await bootcamp.remove();
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
