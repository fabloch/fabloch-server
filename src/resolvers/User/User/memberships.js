const memberships = async (user, args, { mongo: { Memberships } }) => {
  const membershipList = await Memberships.find({ ownerId: user._id }).toArray()
  return membershipList
}

export default memberships
