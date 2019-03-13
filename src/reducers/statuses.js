import uniq from 'lodash/uniq'
import reduce from 'lodash/reduce'
import map from 'lodash/map'

const initialState = {
  statusesByIds: {},
  timelines: {
  }
}

const initialTimeline = {
  statusIds: []
}

const addStatuses = (state, { statuses }) => {
  const newStatuses = reduce(statuses, (result, status) => {
    result[status.id] = { ...(state.statusesByIds[status.id] || {}), ...status }
    return result
  }, {})

  return {
    ...state,
    statusesByIds: {
      ...state.statusesByIds,
      ...newStatuses
    }
  }
}

const addStatus = (state, { status }) => {
  return addStatuses(state, { statuses: [status] })
}

const addStatusIdsToTimeline = (state, { statusIds, timelineName }) => {
  let timeline = state.timelines[timelineName] || { ...initialTimeline }
  timeline = { ...timeline, statusIds: uniq([...statusIds, ...timeline.statusIds]) }
  return {
    ...state,
    timelines: {
      ...state.timelines,
      [timelineName]: timeline
    }
  }
}

const addStatusesToTimeline = (state, { statuses, timelineName }) => {
  let newState = addStatuses(state, { statuses })
  const statusIds = map(statuses, 'id')
  newState = addStatusIdsToTimeline(newState, { statusIds, timelineName })

  return newState
}

const reducers = {
  addStatus,
  addStatuses,
  addStatusIdsToTimeline,
  addStatusesToTimeline
}

const actions = {
  addStatus: ({ status }) => {
    return {
      type: 'addStatus',
      payload: { status }
    }
  },
  addStatuses: ({ statuses }) => {
    return {
      type: 'addStatuses',
      payload: { statuses }
    }
  },
  addStatusIdsToTimeline: ({ statusIds, timelineName }) => {
    return {
      type: 'addStatusIdsToTimeline',
      payload: { statusIds, timelineName }
    }
  },
  addStatusesToTimeline: ({ statuses, timelineName }) => {
    return {
      type: 'addStatusesToTimeline',
      payload: { statuses, timelineName }
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
