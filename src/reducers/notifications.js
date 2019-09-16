import { map, reduce, uniq } from 'lodash'

const initialState = {
  list: [],
  notificationsByIds: {}
}

const addNotifications = (state, { notifications }) => {
  const newNotifications = reduce(notifications, (result, notification) => {
    result[notification.id] = { ...state.notificationsByIds[notification.id], ...notification }
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

const reducers = {
  addNotifications,
  addNotification,
  addNotificationIds,
  clearNotifications
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
