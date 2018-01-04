const authenticate = async (req, Users) => (
  // TODO: problème d'authentification, il prend le premier avec pas de jwt
  req.user ? Users.findOne({ jwt: req.user.jwt, version: req.user.version }) : null
)

export default authenticate
