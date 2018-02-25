const memberships = async (user, context) => {
  const { mongo: { Memberships } } = context
  const membershipList = await Memberships.find({ ownerId: user._id }).toArray()
  return membershipList
}

export default memberships
