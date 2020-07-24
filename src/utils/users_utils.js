import forEach from 'lodash/forEach'

export const getUsersFromStatusesList = (statuses) => {
  const users = []

  forEach(statuses, status => {
    users.push(status.account)
    if (status.reblog) {
      users.push(status.reblog.account)
    }
  })
  return users
}
