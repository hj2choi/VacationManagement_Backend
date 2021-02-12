const timezoneoffset_mins = require("../config/config.json").TIMEZONEOFFSET_MINS
const MUNITE_MILLIS = 60000
const DAY_MILLIS = 86400000

class ServerDateManager {
  constructor() {
    this.dayoffset = 0
  }

  getAdjustedCurrentTime() {
    var now = new Date(Date.now())
    now.setMilliseconds(now.getMilliseconds() + timezoneoffset_mins * MUNITE_MILLIS + this.dayoffset * DAY_MILLIS)
    return now
  }

  todayISOString() {
    //console.log(this.getAdjustedCurrentTime().toISOString())
    return this.getAdjustedCurrentTime().toISOString().split("T")[0]
  }

  getTimeMillis() {
    return this.getAdjustedCurrentTime().getMilliseconds()
  }

  incrementDay() {
    this.dayoffset += 1
  }

}

module.exports = new ServerDateManager()
