const initialState = {
  statusesByIds: {},
  timelines: {
  }
}

const reducers = {
  addStatus: (state, {status}) => {
    const newStatus = {...(state.statusesByIds[status.id] || {}), ...status}
    return {...state, statusesByIds: {...state.statusesByIds, [status.id]: newStatus}}
  }
}

const actions = {
  addStatus: ({status}) => {
    return {
      type: 'addStatus',
      payload: {status}
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
