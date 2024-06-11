const express = require("express");
const router = express.Router();
const RailwayLine = require("../models/RailwayLine");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /railwaylines:
 *   get:
 *     summary: Get all railway lines
 *     description: Retrieve a list of all railway lines.
 *     tags: [Railway Line]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of railway lines.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RailwayLine'
 *       '500':
 *         description: Failed to fetch railway lines
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const railwayLines = await RailwayLine.find();
    res.json(railwayLines);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch railway lines", error: err.message });
  }
});

/**
 * @swagger
 * /railwaylines:
 *   post:
 *     summary: Create a new railway line
 *     description: Create a new railway line.
 *     tags: [Railway Line]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       '201':
 *         description: Railway line created successfully
 *       '400':
 *         description: Missing required fields
 *       '500':
 *         description: Failed to create railway line
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Create and save the new railway line
    const newRailwayLine = new RailwayLine({ name });
    const savedRailwayLine = await newRailwayLine.save();
    res.status(201).json(savedRailwayLine);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create railway line", error: err.message });
  }
});

/**
 * @swagger
 * /railwaylines/{id}:
 *   get:
 *     summary: Get a specific railway line by ID
 *     description: Retrieve a railway line by its ID.
 *     tags: [Railway Line]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the railway line to retrieve
 *     responses:
 *       '200':
 *         description: Railway line found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RailwayLine'
 *       '404':
 *         description: Railway line not found
 *       '500':
 *         description: Failed to fetch railway line
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const railwayLine = await RailwayLine.findById(req.params.id);
    if (!railwayLine) {
      return res.status(404).json({ message: "Railway line not found" });
    }
    res.json(railwayLine);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch railway line", error: err.message });
  }
});

/**
 * @swagger
 * /railwaylines/{id}:
 *   put:
 *     summary: Update a railway line by ID
 *     description: Update a railway line by its ID.
 *     tags: [Railway Line]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the railway line to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               stations:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - name
 *     responses:
 *       '200':
 *         description: Railway line updated successfully
 *       '400':
 *         description: Missing required fields
 *       '404':
 *         description: Railway line not found
 *       '500':
 *         description: Failed to update railway line
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, stations } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedRailwayLine = await RailwayLine.findByIdAndUpdate(
      req.params.id,
      { name, stations },
      { new: true }
    );
    if (!updatedRailwayLine) {
      return res.status(404).json({ message: "Railway line not found" });
    }
    res.json(updatedRailwayLine);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update railway line", error: err.message });
  }
});

/**
 * @swagger
 * /railwaylines/{id}:
 *   delete:
 *     summary: Delete a railway line by ID
 *     description: Delete a railway line by its ID.
 *     tags: [Railway Line]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the railway line to delete
 *     responses:
 *       '200':
 *         description: Railway line deleted successfully
 *       '404':
 *         description: Railway line not found
 *       '500':
 *         description: Failed to delete railway line
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedRailwayLine = await RailwayLine.findByIdAndDelete(
      req.params.id
    );
    if (!deletedRailwayLine) {
      return res.status(404).json({ message: "Railway line not found" });
    }
    res.json({
      message: "Railway line deleted successfully",
      deletedRailwayLine,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete railway line", error: err.message });
  }
});

module.exports = router;
