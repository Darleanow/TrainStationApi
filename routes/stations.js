const express = require("express");
const router = express.Router();
const Station = require("../models/Station");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: API endpoints for managing stations
 */

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Get all stations
 *     description: Retrieve a list of all stations.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of stations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Station'
 *       '500':
 *         description: Failed to fetch stations
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
 * @swagger
 * /stations/{id}:
 *   get:
 *     summary: Get a specific station by ID
 *     description: Retrieve a station by its ID.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the station to retrieve
 *     responses:
 *       '200':
 *         description: Station found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       '404':
 *         description: Station not found
 *       '500':
 *         description: Failed to fetch station
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
 * @swagger
 * /stations:
 *   post:
 *     summary: Add a new station
 *     description: Add a new station.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationInput'
 *     responses:
 *       '201':
 *         description: Station added successfully
 *       '400':
 *         description: Missing required fields
 *       '500':
 *         description: Failed to add station
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, city } = req.body;
    if (!name || !city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingStation = await Station.findOne({ name, city });
    if (existingStation) {
      return res.status(400).json({ message: "Station already exists" });
    }

    const newStation = new Station({ name, city });
    const savedStation = await newStation.save();
    res.status(201).json(savedStation);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add station", error: err.message });
  }
});

/**
 * @swagger
 * /stations/{id}:
 *   put:
 *     summary: Update a station by ID
 *     description: Update a station by its ID.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the station to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationInput'
 *     responses:
 *       '200':
 *         description: Station updated successfully
 *       '400':
 *         description: Missing required fields
 *       '404':
 *         description: Station not found
 *       '500':
 *         description: Failed to update station
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
 * @swagger
 * /stations/{id}:
 *   delete:
 *     summary: Delete a station by ID
 *     description: Delete a station by its ID.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the station to delete
 *     responses:
 *       '200':
 *         description: Station deleted successfully
 *       '404':
 *         description: Station not found
 *       '500':
 *         description: Failed to delete station
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
