import Link from './Link'

const Query = `
  type Query {
    allLinks(filter: LinkFilter, skip: Int, first: Int): [Link!]!
  }
`

export default () => [Query, Link]
