import reduce from 'lodash/reduce'
import { emojify, emojifyAccount } from '../utils/parse_utils'
import { addStatuses } from '../utils/status_utils'

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
      statuses ? statuses.map(status => {
        status.account = emojifyAccount(status.account)
        return {
          ...status,
          content: emojify(status.content, status.emojis),
          spoiler_text: emojify(status.spoiler_text, status.emojis)
        }
      }) : [])
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

const reducers = {
  addUsers,
  addUser,
  setCurrentUser,
  updateCurrentUser,
  addUserStatuses,
  deleteUserStatus
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
