import mongoose from "mongoose";
const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`${process.env.MONGO_URI}`);
  console.log(`Mongo Connected ${conn.connection.host}`);
};

export default connectDb;
