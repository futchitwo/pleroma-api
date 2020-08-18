import { reduce } from 'lodash'
import { emojify, emojifyStatus } from '../utils/parse_utils'
import { addStatuses } from '../utils/status_utils'
import { addIdsToList } from '../utils/common_utils'

const initialState = {
  usersByIds: {},
  currentUser: false
}

const addUsers = (state, { users }) => {
  const newUsers = reduce(users, (result, user) => {
    const newUser = { ...(state.usersByIds[user.id] || {}), ...user }

    newUser.display_name = emojify(newUser.display_name, newUser.emojis)
    newUser.note = emojify(newUser.note, newUser.emojis)
    result[newUser.id] = newUser
    return result
  }, {})

  return {
    ...state,
    usersByIds: {
      ...state.usersByIds,
      ...newUsers
    }
  }
}

const addUser = (state, { user }) => {
  return addUsers(state, { users: [user] })
}

const setCurrentUser = (state, { user }) => {
  return {
    ...state,
    currentUser: user
  }
}

const updateCurrentUser = (state, { user }) => {
  return {
    ...state,
    currentUser: { ...state.currentUser, ...user }
  }
}

const addUserStatuses = (state, { userId, statuses }) => {
  const oldUser = state.usersByIds[userId] || {}
  const user = {
    ...oldUser,
    statuses: addStatuses(oldUser.statuses || [],
      statuses ? statuses.map(status => ({
        ...status,
        ...emojifyStatus(status, {})
      })) : [])
  }
  return {
    ...state,
    usersByIds: {
      ...state.usersByIds,
      [userId]: user
    }
  }
}

const addUserFollowers = (state, { userId, followers }) => {
  const oldUser = state.usersByIds[userId] || {}
  const user = {
    ...oldUser,
    followers: addIdsToList(oldUser.followers || [],
      followers ? followers.map(account => account.id) : [])
  }

  return {
    ...state,
    usersByIds: {
      ...state.usersByIds,
      [userId]: user
    }
  }
}

const addUserFollowing = (state, { userId, following }) => {
  const oldUser = state.usersByIds[userId] || {}
  const user = {
    ...oldUser,
    following: addIdsToList(oldUser.following || [],
      following ? following.map(account => account.id) : [])
  }

  return {
    ...state,
    usersByIds: {
      ...state.usersByIds,
      [userId]: user
    }
  }
}

const deleteUserStatus = (state, { userId, statusId }) => {
  const oldUser = state.usersByIds[userId] || {}
  const user = {
    ...oldUser,
    statuses: (oldUser.statuses || []).filter(({ id }) => id !== statusId)
  }

  return {
    ...state,
    usersByIds: {
      ...state.usersByIds,
      [userId]: user
    }
  }
}

const updateUnreadNotificationsCount = (state, { unreadNotificationsCount }) => {
  return {
    ...state,
    currentUser: {
      ...state.currentUser,
      pleroma: {
        ...state.currentUser.pleroma,
        unread_notifications_count: unreadNotificationsCount
      }
    }
  }
}

const reducers = {
  addUsers,
  addUser,
  setCurrentUser,
  updateCurrentUser,
  addUserStatuses,
  addUserFollowers,
  addUserFollowing,
  deleteUserStatus,
  updateUnreadNotificationsCount
}

const actions = {
  addUser: ({ user }) => {
    return {
      type: 'addUser',
      payload: { user }
    }
  },
  addUsers: ({ users }) => {
    return {
      type: 'addUsers',
      payload: { users }
    }
  },
  setCurrentUser: ({ user }) => {
    return {
      type: 'setCurrentUser',
      payload: { user }
    }
  },
  updateCurrentUser: (user) => {
    return {
      type: 'updateCurrentUser',
      payload: { user }
    }
  },
  addUserStatuses: ({ userId, statuses }) => {
    return {
      type: 'addUserStatuses',
      payload: { userId, statuses }
    }
  },
  addUserFollowers: ({ userId, followers }) => {
    return {
      type: 'addUserFollowers',
      payload: { userId, followers }
    }
  },
  addUserFollowing: ({ userId, following }) => {
    return {
      type: 'addUserFollowing',
      payload: { userId, following }
    }
  },
  deleteUserStatus: ({ userId, statusId }) => {
    return {
      type: 'deleteUserStatus',
      payload: { userId, statusId }
    }
  },
  updateUnreadNotificationsCount: ({ unreadNotificationsCount }) => {
    return {
      type: 'updateUnreadNotificationsCount',
      payload: { unreadNotificationsCount }
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
