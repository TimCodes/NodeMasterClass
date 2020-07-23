export default function logger(req, res, next) {
  console.log("req rescieved");
  console.log(`${req}`);
  return next();
}
