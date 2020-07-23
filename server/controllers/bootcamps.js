import resource from "resource-router-middleware";
import bootcamps from "../models/bootcamps";
export default ({ config, db }) =>
  resource({
    /** Property name to store preloaded entity on `request`. */
    id: "bootcamp",

    /** For requests with an `id`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[id] = data`.
     */
    load(req, id, callback) {
      let bootcamp = bootcamps.find((bootcamp) => bootcamp.id === id),
        err = bootcamp ? null : "Not found";
      callback(err, bootcamp);
    },

    /** GET / - List all entities */
    index({ params }, res) {
      res.json(bootcamp);
    },

    /** POST / - Create a new entity */
    create({ body }, res) {
      body.id = bootcamps.length.toString(36);
      bootcamps.push(body);
      res.json(body);
    },

    /** GET /:id - Return a given entity */
    read({ bootcamp }, res) {
      res.json(bootcamp);
    },

    /** PUT /:id - Update a given entity */
    update({ bootcamp, body }, res) {
      for (let key in body) {
        if (key !== "id") {
          bootcamp[key] = body[key];
        }
      }
      res.sendStatus(204);
    },

    /** DELETE /:id - Delete a given entity */
    delete({ bootcamp }, res) {
      bootcamps.splice(bootcamps.indexOf(bootcamp), 1);
      res.sendStatus(204);
    },
  });
