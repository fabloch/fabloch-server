import { mergeResolvers } from "merge-graphql-schemas"
import eventResolvers from "../modules/Event/resolvers"
import eventTicketResolvers from "../modules/EventTicket/resolvers"
import membershipResolvers from "../modules/Membership/resolvers"
import newcomerResolvers from "../modules/Newcomer/resolvers"
import resourceResolvers from "../modules/Resource/resolvers"
import sharedResolvers from "../modules/_shared/resolvers"
import userResolvers from "../modules/User/resolvers"

const resolvers = [
  eventResolvers,
  eventTicketResolvers,
  membershipResolvers,
  newcomerResolvers,
  resourceResolvers,
  sharedResolvers,
  userResolvers,
]

export default mergeResolvers(resolvers)
