import { formatError } from "graphql"

export default function (error) {
  const data = formatError(error)
  const { originalError } = error
  data.field = originalError && originalError.field
  return data
}
