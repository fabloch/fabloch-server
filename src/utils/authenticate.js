const authenticate = async (req, Users) => (
  req.user ? Users.findOne({ jwt: req.user.jwt, version: req.user.version }) : null
)

export default authenticate
