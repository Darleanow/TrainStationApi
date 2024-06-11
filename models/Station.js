const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  railways: [{ type: mongoose.Schema.Types.ObjectId, ref: "RailWayLine" }]
});

module.exports = mongoose.model("Station", stationSchema);
