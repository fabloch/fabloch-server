import { ObjectId } from "mongodb"
import moment from "moment"
import ValidationError from "../../validations/validationError"
import checkAuthenticatedUser from "../../validations/checkAuthenticatedUser"

export default {
  Query: {
    userMembershipData: async (_, __, { mongo: { Memberships }, user }) => {
      checkAuthenticatedUser(user)
      const data = {}
      data.memberships = await Memberships
        .find({ ownerId: ObjectId(user._id) })
        .sort({ end: -1 }).toArray()
      if (data.memberships) {
        data.wasMember = true
      } else {
        data.wasMember = false
        data.alertLevel = 0
      }
      if (data.wasMember) {
        const lastMemberDayToNow = moment(data.memberships[0].end).diff(moment().utc(), "days")
        if (lastMemberDayToNow < 0) {
          // User is no longer member
          data.alertLevel = 3
          data.isMember = false
          data.present = null
          data.nextStart = moment().utc().format("YYYY-MM-DD")
        } else {
          // User is member
          data.isMember = true
          data.present = data.memberships[0]
          data.nextStart = moment(data.memberships[0].end).add(1, "d").format("YYYY-MM-DD")
          if (lastMemberDayToNow < 30) {
            // membership ends in less than 30 days
            data.alertLevel = 2
          } else if (lastMemberDayToNow < 60) {
            // membership ends between 30 and 60
            data.alertLevel = 1
          } else {
            // membership ends in more than 60 days
            data.alertLevel = 0
          }
        }
      }
      data.nextEnd = moment(data.nextStart).add(1, "y").subtract(1, "d").format("YYYY-MM-DD")
      return data
    },
    userMemberships: async (_, __, { mongo: { Memberships }, user }) => {
      checkAuthenticatedUser(user)
      const memberships = await Memberships.find({ ownerId: ObjectId(user._id) }).toArray()
      return memberships
    },
  },
  Mutation: {
    createMembership: async (_, data, context) => {
      const { mongo: { Memberships }, user } = context
      checkAuthenticatedUser(user)
      // check existing membership for the given user and given dates
      const overlappingMembership = await Memberships.findOne({
        ownerId: user._id,
        end: { $gt: data.membership.start },
      })
      if (overlappingMembership) {
        throw new ValidationError(`Previous membership overlapping (ending ${moment(overlappingMembership.end).fromNow()}).`, "start")
        // there is an overlapping membership
      }
      const newMembership = {
        ...data.membership,
        ownerId: user._id,
      }
      const response = await Memberships.insert(newMembership)
      const [_id] = response.insertedIds
      newMembership._id = _id
      return newMembership
    },
  },
  Membership: {
    id: membership => membership._id.toString(),
    start: membership => moment(membership.start).format("YYYY-MM-DD"),
    end: membership => moment(membership.end).format("YYYY-MM-DD"),
    owner: async (membership, _, { mongo: { Users } }) =>
      Users.findOne({ _id: membership.ownerId }),
  },
}
