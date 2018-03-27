import { ObjectId } from "mongodb"
import moment from "moment"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"
import { sendInvites } from "../mailer"

const sendInvitations = async (
  { invitationInput },
  { mongo: { Newcomers }, user, mailer },
) => {
  checkAuthenticatedUser(user)

  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  const newcomerIds = invitationInput.newcomerIds.map(id => ObjectId(id))
  await Newcomers.updateMany(
    { _id: { $in: newcomerIds } },
    {
      $set: { invitationSentAt: moment().utc().toDate() },
      $inc: { invitationSentCount: 1 },
    },
    { returnOriginal: false },
  )
  const newcomers = await Newcomers.find({ _id: { $in: newcomerIds } }).toArray()
  sendInvites(newcomers, invitationInput.message, mailer)
  return newcomers
}

export default sendInvitations
