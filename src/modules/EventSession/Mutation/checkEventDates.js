import moment from "moment"

export default (eventSession, errors) => {
  if (eventSession.start && eventSession.end) {
    if (moment().utc().diff(eventSession.start) > 0) {
      errors.push({
        key: "start",
        message: "Start date is in the past.",
      })
    }
    if (moment(eventSession.end).diff(eventSession.start) < 0) {
      errors.push({
        key: "start",
        message: "Start date is after end date.",
      })
    }
  }
  return errors
}
