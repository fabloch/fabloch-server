import { gql } from "apollo-server-express"

import customScalars from "./customScalars"
import EventCat from "./EventCat"
import EventModel from "./EventModel"
import EventSession from "./EventSession"
import EventTicket from "./EventTicket"
import Media from "./Media"
import Membership from "./Membership"
import Newcomer from "./Newcomer"
import Place from "./Place"
import User from "./User"

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }
`

export default [
  linkSchema,
  customScalars,
  EventCat,
  EventModel,
  EventSession,
  EventTicket,
  Media,
  Membership,
  Newcomer,
  Place,
  User,
]
