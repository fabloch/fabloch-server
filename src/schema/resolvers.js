import { mergeResolvers } from "merge-graphql-schemas"
import eventResolvers from "../modules/Event/resolvers"
import eventTicketResolvers from "../modules/EventTicket/resolvers"
import mediaResolvers from "../modules/Media/resolvers"
import membershipResolvers from "../modules/Membership/resolvers"
import newcomerResolvers from "../modules/Newcomer/resolvers"
import placeResolvers from "../modules/Place/resolvers"
import sharedResolvers from "../modules/_shared/resolvers"
import userResolvers from "../modules/User/resolvers"

const resolvers = [
  eventResolvers,
  eventTicketResolvers,
  mediaResolvers,
  membershipResolvers,
  newcomerResolvers,
  placeResolvers,
  sharedResolvers,
  userResolvers,
]

export default mergeResolvers(resolvers)
