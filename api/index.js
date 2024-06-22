import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const mongoDB = process.env.MONGO_DB;
const port = process.env.PORT || 3000;

mongoose
  .connect(mongoDB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json()); // will allow json as input

app.listen(port, () => {
  console.log("Server listening on port 3000!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// middlewares
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
