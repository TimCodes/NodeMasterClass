import NodeGeoCoder from "node-geocoder";
import dotenv from "dotenv";

dotenv.config();

//console.log(Object.keys(process.env));
const options = {
  provider: "mapquest",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeoCoder(options);

export default geocoder;
