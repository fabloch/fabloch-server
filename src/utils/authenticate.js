const authenticate = async (req, Users) => (
  req.user ? Users.findOne({ email: req.user.email, version: req.user.version }) : null
)

export default authenticate
