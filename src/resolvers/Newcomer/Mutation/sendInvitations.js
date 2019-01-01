import { ObjectId } from "mongodb"
import moment from "moment"
import { combineResolvers } from "graphql-resolvers"

import { isAdmin } from "../../_shared/auth"
import { sendInvites } from "../mailer"

const sendInvitations = combineResolvers(
  isAdmin,
  async (parent, { invitationInput }, { mongo: { Newcomers }, mailer }) => {
    const newcomerIds = invitationInput.newcomerIds.map(id => ObjectId(id))
    await Newcomers.updateMany(
      { _id: { $in: newcomerIds } },
      {
        $set: {
          invitationSentAt: moment()
            .utc()
            .toDate(),
        },
        $inc: { invitationSentCount: 1 },
      },
      { returnOriginal: false },
    )
    const newcomers = await Newcomers.find({ _id: { $in: newcomerIds } }).toArray()
    sendInvites(newcomers, invitationInput.message, mailer)
    return newcomers
  },
)

export default sendInvitations
