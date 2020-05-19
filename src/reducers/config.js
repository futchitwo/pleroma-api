const initialState = {
}

const addConfig = (state, { config }) => ({
  ...state,
  ...config
})
const clear = (state) => ({
  ...initialState
})
const reducers = {
  addConfig,
  clear
}

const actions = {
  addConfig: ({ config }) => {
    return {
      type: 'addConfig',
      payload: { config }
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
