import NodeGeoCoder from "node-geocoder";
//console.log(Object.keys(process.env));
const options = {
  provider: "mapquest",
  apiKey: process.env.GEOCODER_API_KEY,
  httpAdapter: "https",
  formatter: null,
};

const geocoder = NodeGeoCoder(options);

export default geocoder;
