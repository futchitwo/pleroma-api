import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'

export const addStatuses = (oldStatuses, newStatuses) => {
  const statuses = sortBy(oldStatuses.concat(newStatuses), ({ id }) => id).reverse()

  return uniqBy(statuses, ({ id }) => id)
}
