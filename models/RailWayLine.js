const mongoose = require("mongoose");

const railWayLineSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("RailWayLine", railWayLineSchema);
