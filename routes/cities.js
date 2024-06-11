const express = require("express");
const router = express.Router();
const City = require("../models/City");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   GET /cities
 * @desc    Get all cities
 * @access  Private (requires authentication)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch cities", error: err.message });
  }
});

/**
 * @route   GET /cities/:id
 * @desc    Get a specific city by ID
 * @access  Private (requires authentication)
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(city);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch city", error: err.message });
  }
});

/**
 * @route   POST /cities
 * @desc    Add a new city
 * @access  Private (requires authentication)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, country } = req.body;

    if (!name || !country) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCity = new City({ name, country });
    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (err) {
    res.status(500).json({ message: "Failed to add city", error: err.message });
  }
});

/**
 * @route   PUT /cities/:id
 * @desc    Update a city by ID
 * @access  Private (requires authentication)
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, country } = req.body;

    if (!name || !country) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      { name, country },
      { new: true }
    );
    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(updatedCity);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update city", error: err.message });
  }
});

/**
 * @route   DELETE /cities/:id
 * @desc    Delete a city by ID
 * @access  Private (requires authentication)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);
    if (!deletedCity) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(deletedCity);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete city", error: err.message });
  }
});

module.exports = router;
