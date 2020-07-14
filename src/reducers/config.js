const initialState = {
}

const addConfig = (state, { config }) => ({
  ...state,
  ...config
})
const addEmojis = (state, { emojis }) => ({
  ...state,
  emojis
})
const clear = (state) => ({
  ...initialState
})
const reducers = {
  addConfig,
  addEmojis,
  clear
}

const actions = {
  addConfig: ({ config }) => {
    return {
      type: 'addConfig',
      payload: { config }
    }
  },
  addEmojis: ({ emojis }) => {
    return {
      type: 'addEmojis',
      payload: { emojis }
    }
  },
  clear: () => {
    return {
      type: 'clear',
      payload: {}
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
