import moment from "moment"

export default (event, errors) => {
  if (event.start && event.end) {
    if (moment().utc().diff(event.start) > 0) {
      errors.push({
        key: "start",
        message: "Start date is in the past.",
      })
    }
    if (moment(event.end).diff(event.start) < 0) {
      errors.push({
        key: "start",
        message: "Start date is after end date.",
      })
    }
  }
  return errors
}
