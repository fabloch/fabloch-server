import ValidationError from '../../validations/validationError'
import getAuthenticatedUser from '../../validations/getAuthenticatedUser'

export default {
  Query: {
    Memberships: async (_, { userId }, { mongo: { Memberships } }) => {
      const memberships = await Memberships.find({ owner: userId }).toArray()
      return memberships
    },
  },
  Mutation: {
    createMembership: async (_, data, context) => {
      const { mongo: { Memberships } } = context
      // check authenticated
      const user = await getAuthenticatedUser(context)
      // check existing membership for the given user and given dates
      const overlappingMembership = await Memberships.findOne({
        owner: user._id,
        endDate: { $gt: data.membership.startDate },
      })
      if (overlappingMembership) {
        throw new ValidationError(`A membership already exists at this date (ending ${overlappingMembership.endDate}).`, 'startDate')
        // there is an overlapping membership
      }
      const newMembership = {
        ...data.membership,
        owner: user._id,
      }
      const response = await Memberships.insert(newMembership)
      const [id] = response.insertedIds
      newMembership.id = id
      return newMembership
    },
  },
  Membership: {
    id: membership => membership._id.toString(),
    owner: async (membership, _, { mongo: { Users } }) =>
      Users.findOne({ _id: membership.owner }),
  },
}
