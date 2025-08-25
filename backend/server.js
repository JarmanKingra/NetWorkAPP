const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const postroutes = require("./routes/posts.routes");
const userroutes = require("./routes/user.routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // so you can read JSON bodies
app.use(postroutes);     
app.use(userroutes);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI); 
    console.log("✅ MongoDB connected");
 
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
}; 
 
start();
