import moment from "moment"

export default (event) => {
  if (moment().utc().diff(event.start) > 0) {
    throw new Error("Start date is in the past.")
  }
  if (moment(event.end).diff(event.start) < 0) {
    throw new Error("Start date is after end date.")
  }
}
