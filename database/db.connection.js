import mongoose from "mongoose";
const connection = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/social-media-app")
    .then(() => {
      console.log("database conneted successfully");
    })
    .catch((err) => {
      console.log("connection error!");
    });
};

export default connection;
