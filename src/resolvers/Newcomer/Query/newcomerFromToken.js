import getNewcomerFromToken from "../_shared/getNewcomerFromToken"

const newcomerFromToken = async (parent, args, { mongo: { Newcomers } }) => {
  const newcomer = await getNewcomerFromToken(args.token, Newcomers)
  return newcomer
}

export default newcomerFromToken
