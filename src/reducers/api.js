const initialState = {
  config: {}
}
const reducers = {
  addConfig: (state, { config }) => {
    return {
      ...state,
      config: {
        ...state.config,
        ...config
      }
    }
  }
}

const actions = {
  addConfig: ({ config }) => {
    return {
      type: 'addConfig',
      payload: { config }
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
