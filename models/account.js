const mongoose = require("mongoose")
const config = require("../config/config")

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  remaining_vacation: {
    type: Number,
    default: config.YEARLY_VACATION_DAYS,
    required: true
  }
})

module.exports = mongoose.model("Account", accountSchema)
