import reduce from 'lodash/reduce'
import { emojify } from '../utils/parse_utils'

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

const reducers = {
  addUsers,
  addUser,
  setCurrentUser,
  updateCurrentUser
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
