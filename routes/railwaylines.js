const express = require("express");
const router = express.Router();
const RailWayLine = require("../models/RailWayLine");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   POST /railway-line
 * @desc    Create a new railway line
 * @access  Private (requires authentication)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Create and save the new railway line
    const newRailWayLine = new RailWayLine({ name });
    const savedRailWayLine = await newRailWayLine.save();
    res.status(201).json(savedRailWayLine);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create railway line", error: err.message });
  }
});

/**
 * @route   GET /railway-line
 * @desc    Get all railway lines
 * @access  Private (requires authentication)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const railWayLines = await RailWayLine.find();
    res.json(railWayLines);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch railway lines", error: err.message });
  }
});

/**
 * @route   GET /railway-line/:id
 * @desc    Get a specific railway line by ID
 * @access  Private (requires authentication)
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const railWayLine = await RailWayLine.findById(req.params.id);
    if (!railWayLine) {
      return res.status(404).json({ message: "Railway Line not found" });
    }
    res.json(railWayLine);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch railway line", error: err.message });
  }
});

/**
 * @route   PUT /railway-line/:id
 * @desc    Update a railway line by ID
 * @access  Private (requires authentication)
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, stations } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedRailWayLine = await RailWayLine.findByIdAndUpdate(
      req.params.id,
      { name, stations },
      { new: true }
    );
    if (!updatedRailWayLine) {
      return res.status(404).json({ message: "Railway Line not found" });
    }
    res.json(updatedRailWayLine);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update railway line", error: err.message });
  }
});

/**
 * @route   DELETE /railway-line/:id
 * @desc    Delete a railway line by ID
 * @access  Private (requires authentication)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedRailWayLine = await RailWayLine.findByIdAndDelete(
      req.params.id
    );
    if (!deletedRailWayLine) {
      return res.status(404).json({ message: "Railway Line not found" });
    }
    res.json({
      message: "Railway Line deleted successfully",
      deletedRailWayLine,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete railway line", error: err.message });
  }
});

module.exports = router;
