const express = require("express");
const router = express.Router();
const Station = require("../models/Station");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   GET /stations
 * @desc    Get all stations
 * @access  Private (requires authentication)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch stations", error: err.message });
  }
});

/**
 * @route   GET /stations/:id
 * @desc    Get a specific station by ID
 * @access  Private (requires authentication)
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }
    res.json(station);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch station", error: err.message });
  }
});

/**
 * @route   POST /stations
 * @desc    Add a new station
 * @access  Private (requires authentication)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, city, railways } = req.body;
    if (!name || !city ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingStation = await Station.findOne({ name, city, railways });
    if (existingStation) {
      return res.status(400).json({ message: "Station already exists" });
    }

    const newStation = new Station({ name, city, railways });
    const savedStation = await newStation.save();
    res.status(201).json(savedStation);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add station", error: err.message });
  }
});

/**
 * @route   PUT /stations/:id
 * @desc    Update a station by ID
 * @access  Private (requires authentication)
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, city } = req.body;
    if (!name || !city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id,
      { name, city },
      { new: true, useFindAndModify: false }
    );
    if (!updatedStation) {
      return res.status(404).json({ message: "Station not found" });
    }
    res.json(updatedStation);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update station", error: err.message });
  }
});

/**
 * @route   DELETE /stations/:id
 * @desc    Delete a station by ID
 * @access  Private (requires authentication)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedStation = await Station.findByIdAndDelete(req.params.id);
    if (!deletedStation) {
      return res.status(404).json({ message: "Station not found" });
    }
    res.json({
      message: "Station deleted successfully",
      deletedStation,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete station", error: err.message });
  }
});

module.exports = router;
