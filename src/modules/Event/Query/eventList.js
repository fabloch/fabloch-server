/* eslint-disable camelcase */
const buildFilters = ({ OR = [], title_contains, description_contains }) => {
  const filter = (description_contains || title_contains) ? {} : null
  if (description_contains) {
    filter.description = { $regex: `.*${description_contains}.*` }
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

const eventList = async ({ filter }, { mongo: { Events } }) => {
  const query = filter ? { $or: buildFilters(filter) } : {}
  return Events.find(query).toArray()
}

export default eventList