import ValidationError from "../../validations/validationError"
import checkAuthenticatedUser from "../../validations/checkAuthenticatedUser"

export default {
  Query: {
    userMemberships: async (_, __, { mongo: { Memberships }, user }) => {
      checkAuthenticatedUser(user)
      const memberships = await Memberships.find({ ownerId: user._id }).toArray()
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
        throw new ValidationError(`Previous membership overlapping (ending ${overlappingMembership.end}).`, "start")
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
    owner: async (membership, _, { mongo: { Users } }) =>
      Users.findOne({ _id: membership.ownerId }),
  },
}
