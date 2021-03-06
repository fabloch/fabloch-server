/* eslint-disable camelcase */
const buildFilters = ({ OR = [], title_contains, intro_contains, description_contains }) => {
  const filter = description_contains || intro_contains || title_contains ? {} : null
  if (description_contains) {
    filter.description = { $regex: `.*${description_contains}.*` }
  }
  if (intro_contains) {
    filter.intro = { $regex: `.*${intro_contains}.*` }
  }
  if (title_contains) {
    filter.title = { $regex: `.*${title_contains}.*` }
  }

  let filters = filter ? [filter] : []
  for (let i = 0; i < OR.length; i += 1) {
    filters = filters.concat(buildFilters(OR[i]))
  }
  return filters
}
/* eslint-enable */

const eventSessionList = async (_, { filter }, { mongo: { EventSessions } }) => {
  const query = filter ? { $or: buildFilters(filter) } : {}
  return EventSessions.find(query)
    .sort({ start: 1 })
    .toArray()
}

export default eventSessionList
