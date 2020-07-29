export default function logger(req, res, next) {
  console.log("req rescieved");

  return next();
}
