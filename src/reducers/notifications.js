import { map, reduce, uniq, mapValues } from 'lodash'
import { emojifyAccount } from '../utils/parse_utils'

const initialState = {
  list: [],
  notificationsByIds: {}
}

const addNotifications = (state, { notifications }) => {
  const newNotifications = reduce(notifications, (result, notification) => {
    const oldNotification = state.notificationsByIds[notification.id] || {}

    notification.account = emojifyAccount(notification.account, oldNotification.account)
    result[notification.id] = { ...oldNotification, ...notification }
    return result
  }, {})

  const newState = {
    ...state,
    notificationsByIds: {
      ...state.notificationsByIds,
      ...newNotifications
    }
  }
  const notificationIds = map(notifications, 'id')

  return addNotificationIds(newState, { notificationIds })
}

const addNotification = (state, { notification }) => {
  return addNotifications(state, { notifications: [notification] })
}

const addNotificationIds = (state, { notificationIds }) => {
  return {
    ...state,
    list: uniq([...notificationIds, ...state.list])
  }
}

const clearNotifications = (state) => {
  return {
    ...state,
    list: [],
    notificationsByIds: {}
  }
}

const read = (state, { notificationId }) => {
  return {
    ...state,
    notificationsByIds: {
      ...state.notificationsByIds,
      [notificationId]: {
        ...state.notificationsByIds[notificationId],
        pleroma: { is_seen: true }
      }
    }
  }
}

const readAll = (state) => {
  const notificationsByIds = mapValues(
    state.notificationsByIds,
    notification => ({ ...notification, pleroma: { is_seen: true } })
  )

  return {
    ...state,
    notificationsByIds
  }
}

const reducers = {
  addNotifications,
  addNotification,
  addNotificationIds,
  clearNotifications,
  read,
  readAll
}

const actions = {
  addNotification: ({ notification }) => {
    return {
      type: 'addNotification',
      payload: { notification }
    }
  },
  addNotifications: ({ notifications }) => {
    return {
      type: 'addNotifications',
      payload: { notifications }
    }
  },
  addNotificationIds: ({ notificationIds }) => {
    return {
      type: 'addNotificationIds',
      payload: { notificationIds }
    }
  },
  clearNotifications: () => {
    return {
      type: 'clearNotifications'
    }
  },
  read: ({ notificationId }) => {
    return {
      type: 'read',
      payload: { notificationId }
    }
  },
  readAll: () => {
    return {
      type: 'readAll'
    }
  }
}

const reducer = (state = initialState, action) => {
  const fn = reducers[action.type] || ((state) => state)
  return fn(state, action.payload)
}

export default {
  reducer,
  actions
}
