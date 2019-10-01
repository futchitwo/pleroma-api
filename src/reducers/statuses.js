import reduce from 'lodash/reduce'
import map from 'lodash/map'
import slice from 'lodash/slice'
import { emojify } from '../utils/parse_utils'
import { addStatusIds } from '../utils/status_utils'

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
    status.content = emojify(status.content, status.emojis)
    status.spoiler_text = emojify(status.spoiler_text, status.emojis)
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
  timeline = {
    ...timeline,
    statusIds: addStatusIds(timeline.statusIds, statusIds)
  }
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

const cropOlderStatusesFromTimeline = (state, { timelineName, length }) => {
  const timeline = state.timelines[timelineName] || { ...initialTimeline }
  const statusIds = slice(timeline.statusIds, 0, length || 50)
  return {
    ...state,
    timelines: {
      ...state.timelines,
      [timelineName]: {
        ...timeline,
        statusIds
      }
    }
  }
}

const reducers = {
  addStatus,
  addStatuses,
  addStatusIdsToTimeline,
  addStatusesToTimeline,
  cropOlderStatusesFromTimeline
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
  },
  cropOlderStatusesFromTimeline: ({ timelineName, length }) => {
    return {
      type: 'cropOlderStatusesFromTimeline',
      payload: { timelineName, length }
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
