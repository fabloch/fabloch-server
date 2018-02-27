import moment from "moment"

export default (eventModel, errors) => {
  if (eventModel.start && eventModel.end) {
    if (moment().utc().diff(eventModel.start) > 0) {
      errors.push({
        key: "start",
        message: "Start date is in the past.",
      })
    }
    if (moment(eventModel.end).diff(eventModel.start) < 0) {
      errors.push({
        key: "start",
        message: "Start date is after end date.",
      })
    }
  }
  return errors
}
