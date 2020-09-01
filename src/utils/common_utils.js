import sortedUniq from 'lodash/sortedUniq'

export const descId = (idA, idB) => idA > idB ? -1 : 1

export const addIdsToList = (oldIds, newIds) => {
  const ids = oldIds.concat(newIds).sort(descId)
  return sortedUniq(ids)
}
