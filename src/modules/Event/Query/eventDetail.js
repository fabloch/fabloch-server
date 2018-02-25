import { ObjectId } from "mongodb"
import DoesNotExistError from "../../../validations/DoesNotExistError"

const eventDetail = async ({ id }, { mongo: { Events } }) => {
  const event = await Events.findOne({ _id: ObjectId(id) })
  if (!event) {
    throw DoesNotExistError("Event")
  }
  return event
}

export default eventDetail
