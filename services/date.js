const TIMEZONEOFFSET = (new Date()).getTimezoneOffset()
const MUNITE_MILLIS = 60000
const DAY_MILLIS = 86400000

class ServerDateManager {
  constructor() {
    this.dayoffset = 0
  }

  getAdjustedCurrentTime() {
    var now = new Date(Date.now())
    now.setTime(now.getTime() - TIMEZONEOFFSET * MUNITE_MILLIS + this.dayoffset * DAY_MILLIS)
    return now
  }

  todayISOString() {
    //console.log(this.getAdjustedCurrentTime().toISOString())
    return this.getAdjustedCurrentTime().toISOString().split("T")[0]
  }

  yesterdayISOString() {
    //console.log(this.getAdjustedCurrentTime().toISOString())
    var dateobj = this.getAdjustedCurrentTime()
    dateobj.setDate(dateobj.getDate() - 1)
    return dateobj.toISOString().split("T")[0]
  }

  getAdjustedTimeMillis() {
    return this.getAdjustedCurrentTime().getTime()
  }

  incrementDay() {
    this.dayoffset += 1
  }

  resetDayOffset() {
    this.dayoffset = 0
  }

}

module.exports = new ServerDateManager()
