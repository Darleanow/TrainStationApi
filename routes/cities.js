const express = require("express");
const router = express.Router();
const City = require("../models/City");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /city:
 *   get:
 *     summary: Get all Cities
 *     description: Retrieve a list of all Cities.
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of Cities.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       '500':
 *         description: Failed to fetch Cities
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
 * @swagger
 * /city/{id}:
 *   get:
 *     summary: Get a specific city by ID
 *     description: Retrieve a city by its ID.
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the city to retrieve
 *     responses:
 *       '200':
 *         description: City found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       '404':
 *         description: City not found
 *       '500':
 *         description: Failed to fetch city
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
 * @swagger
 * /city:
 *   post:
 *     summary: Add a new city
 *     description: Add a new city.
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CityInput'
 *     responses:
 *       '201':
 *         description: City added successfully
 *       '400':
 *         description: Missing required fields
 *       '500':
 *         description: Failed to add city
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
 * @swagger
 * /city/{id}:
 *   put:
 *     summary: Update a city by ID
 *     description: Update a city by its ID.
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the city to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CityInput'
 *     responses:
 *       '200':
 *         description: City updated successfully
 *       '400':
 *         description: Missing required fields
 *       '404':
 *         description: City not found
 *       '500':
 *         description: Failed to update city
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
 * @swagger
 * /city/{id}:
 *   delete:
 *     summary: Delete a city by ID
 *     description: Delete a city by its ID.
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the city to delete
 *     responses:
 *       '200':
 *         description: City deleted successfully
 *       '404':
 *         description: City not found
 *       '500':
 *         description: Failed to delete city
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
