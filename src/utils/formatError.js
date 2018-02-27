import { formatError } from "graphql"

export default function (error) {
  const data = formatError(error)
  const { originalError } = error
  data.state = originalError && originalError.state
  return data
}
