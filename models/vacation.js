const mongoose = require("mongoose")

const vacationSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Account"
  },
  mode: {
    type: String,
    enum: ["quarter", "half", "full"],
    required: true
  },
  startdate: {
    type: Date,
    default: Date.now,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    default: ""
  }
})

module.exports = mongoose.model("Vacation", vacationSchema)
