import { reduce, uniq } from 'lodash'
import { emojify, emojifyStatus } from '../utils/parse_utils'
import { addStatuses } from '../utils/status_utils'

const initialState = {
  usersByIds: {},
  currentUser: false,
  searchCache: []
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

const addSearchResult = (state, { request, users }) => {
  const searchCache = uniq([request, ...state.searchCache])

  return addUsers({
    ...state,
    searchCache: searchCache.splice(0, 10)
  }, { users })
}

const reducers = {
  addUsers,
  addUser,
  setCurrentUser,
  updateCurrentUser,
  addUserStatuses,
  deleteUserStatus,
  addSearchResult
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
  deleteUserStatus: ({ userId, statusId }) => {
    return {
      type: 'deleteUserStatus',
      payload: { userId, statusId }
    }
  },
  addSearchResult: ({ request, users }) => {
    return {
      type: 'addSearchResult',
      payload: { request, users }
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
