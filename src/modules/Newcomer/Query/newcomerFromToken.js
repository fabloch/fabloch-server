import getNewcomerFromToken from "../_shared/getNewcomerFromToken"

const newcomerFromToken = async (data, { mongo: { Newcomers } }) => {
  const newcomer = await getNewcomerFromToken(data.token, Newcomers)
  return newcomer
}

export default newcomerFromToken
