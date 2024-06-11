const express = require("express");
const mongoose = require("mongoose");

const { swaggerSpec, swaggerUi } = require("./swagger");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const cityRoutes = require("./routes/cities");
const stationRoutes = require("./routes/stations");
const railwayLineRoutes = require("./routes/railwaylines");

app.use("/auth", authRoutes);
app.use("/city", cityRoutes);
app.use("/stations", stationRoutes);
app.use("/railwaylines", railwayLineRoutes);

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));

// Database connection
mongoose
  .connect(
    "mongodb+srv://hugonnierenzo:toor@cluster0.kjsppl1.mongodb.net/TrainStation",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
