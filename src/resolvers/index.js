import { merge } from 'lodash'

import link from './link'
import user from './user'
import vote from './vote'

const resolvers = merge(
  user,
  link,
  vote,
)

export default resolvers
