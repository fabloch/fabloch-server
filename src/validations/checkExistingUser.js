export default async (email, Users) => {
  const user = await Users.findOne({ email })
  if (user) {
    throw new Error("An account was already created with this email.")
  }
}
