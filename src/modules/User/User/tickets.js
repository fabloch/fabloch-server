const memberships = async (user, context) => {
  const { mongo: { EventTickets } } = context
  const membershipList = await EventTickets.find({ ownerId: user._id }).toArray()
  return membershipList
}

export default memberships
