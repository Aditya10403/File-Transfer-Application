import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import fs from "fs/promises";

dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const mongoDB = process.env.MONGO_DB;
const port = process.env.PORT || 3000;

mongoose.connect(mongoDB, {
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust origin based on your client's URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle file upload
  socket.on('fileUpload', async (formData, callback) => {
    try {
      const file = formData.get('file');
      const fileName = formData.get('fileName');

      if (!file || !fileName) {
        throw new Error('File or file name is missing');
      }

      // Adjust the file path where you want to save the uploaded file
      const filePath = path.join(__dirname, 'uploads', fileName);

      // Save file to server
      await fs.writeFile(filePath, file);

      // Send response with download URL
      const downloadUrl = `/uploads/${fileName}`; // Adjust URL as needed
      callback({ success: true, url: downloadUrl });
      socket.emit('fileUploaded', downloadUrl); // Emit to sender

    } catch (error) {
      console.error('Error uploading file:', error.message);
      callback({ success: false, error: error.message });
    }
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message, statusCode });
});
