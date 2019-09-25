import sortedUniq from 'lodash/sortedUniq'

export const descId = (idA, idB) => idA > idB ? -1 : 1

export const addStatusIds = (oldIds, newIds) => {
  const statusIds = oldIds.concat(newIds).sort(descId)
  return sortedUniq(statusIds)
}
