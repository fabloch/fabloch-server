import moment from "moment"

export default (validationErrors, eventSession) => {
  if (eventSession.start && eventSession.end) {
    if (
      moment()
        .utc()
        .diff(eventSession.start) > 0
    ) {
      const inPast = "Start date is in the past."
      if (validationErrors.start) {
        validationErrors.start.push(inPast)
      }
      validationErrors.start = [inPast]
    }
    if (moment(eventSession.end).diff(eventSession.start) < 0) {
      const flippedDates = "Start date is after end date."
      if (validationErrors.start) {
        validationErrors.start.push(flippedDates)
      }
      validationErrors.start = [flippedDates]
    }
  }
  return validationErrors
}
