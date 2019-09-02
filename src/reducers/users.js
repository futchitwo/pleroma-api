import reduce from 'lodash/reduce'
import { emojify } from '../utils/parse_utils'

const initialState = {
  usersByIds: {},
  currentUser: false
}

const addUsers = (state, { users }) => {
  const newUsers = reduce(users, (result, user) => {
    user.display_name = emojify(user.display_name, user.emojis)
    user.note = emojify(user.note, user.emojis)
    result[user.id] = { ...(state.usersByIds[user.id] || {}), ...user }
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
  addUsers(state, { users: [user] })
}

const setCurrentUser = (state, { user }) => {
  return {
    ...state,
    currentUser: user
  }
}

const reducers = {
  addUsers,
  addUser,
  setCurrentUser
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
