const authenticate = async (req, Users) => {
  return req.user ? Users.findOne({ email: req.user.email, version: req.user.version }) : null
}

export default authenticate
