const mongoose = require("mongoose");

const railWayLineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Station" }],
});

module.exports = mongoose.model("RailWayLine", railWayLineSchema);
