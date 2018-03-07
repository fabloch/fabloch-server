import { mergeResolvers } from "merge-graphql-schemas"
import eventModelResolvers from "../modules/EventModel/resolvers"
import eventSessionResolvers from "../modules/EventSession/resolvers"
import eventTicketResolvers from "../modules/EventTicket/resolvers"
import mediaResolvers from "../modules/Media/resolvers"
import membershipResolvers from "../modules/Membership/resolvers"
import newcomerResolvers from "../modules/Newcomer/resolvers"
import placeResolvers from "../modules/Place/resolvers"
import sharedResolvers from "../modules/_shared/resolvers"
import eventCatResolvers from "../modules/EventCat/resolvers"
import userResolvers from "../modules/User/resolvers"

const resolvers = [
  eventModelResolvers,
  eventSessionResolvers,
  eventTicketResolvers,
  mediaResolvers,
  membershipResolvers,
  newcomerResolvers,
  placeResolvers,
  sharedResolvers,
  eventCatResolvers,
  userResolvers,
]

export default mergeResolvers(resolvers)
