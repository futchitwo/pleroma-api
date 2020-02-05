import sortedUniq from 'lodash/sortedUniq'
import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'

export const descId = (idA, idB) => idA > idB ? -1 : 1

export const addStatusIds = (oldIds, newIds) => {
  const statusIds = oldIds.concat(newIds).sort(descId)
  return sortedUniq(statusIds)
}

export const addStatuses = (oldStatuses, newStatuses) => {
  const statuses = sortBy(oldStatuses.concat(newStatuses), ({ id }) => id).reverse()

  return uniqBy(statuses, ({ id }) => id)
}
