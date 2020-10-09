import reduce from 'lodash/reduce'
import map from 'lodash/map'
import slice from 'lodash/slice'
import forEach from 'lodash/forEach'
import { emojifyStatus, emojifyAccount } from '../utils/parse_utils'
import { addIdsToList } from '../utils/common_utils'

const initialState = {
  statusesByIds: {},
  timelines: {
  },
  tag: []
}

const initialTimeline = {
  statusIds: []
}

const addStatuses = (state, { statuses }) => {
  const newStatuses = reduce(statuses, (result, status) => {
    const oldStatus = state.statusesByIds[status.id] || {}
    result[status.id] = { ...oldStatus, ...emojifyStatus(status, oldStatus) }
    const tempStatus = result[status.id]
    if (tempStatus.context) {
      if (tempStatus.context.ancestors) {
        tempStatus.context.ancestors = tempStatus.context.ancestors.map(item => ({
          ...item,
          ...emojifyStatus(item, {})
        }))
      }
      if (tempStatus.context.descendants) {
        tempStatus.context.descendants = tempStatus.context.descendants.map(item => ({
          ...item,
          ...emojifyStatus(item, {})
        }))
      }
    }
    if (tempStatus.pleroma && tempStatus.pleroma.emoji_reactions) {
      tempStatus.pleroma.emoji_reactions = tempStatus.pleroma.emoji_reactions.map(item => ({
        ...item,
        accounts: item.accounts ? item.accounts.map(account => emojifyAccount(account, {})) : null
      }))
    }
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
    statusIds: addIdsToList(timeline.statusIds, statusIds)
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

const deleteStatus = (state, { statusId }) => {
  const newState = { ...state }
  delete newState.statusesByIds[statusId]
  forEach(newState.timelines, (value, key) => {
    newState.timelines[key].statusIds = newState.timelines[key].statusIds.filter(id => id !== statusId)
  })
  return newState
}

const addTagTimeline = (state, { statuses }) => {
  const newState = addStatuses(state, { statuses })
  const timeline = state.tag

  return {
    ...newState,
    tag: addIdsToList(timeline, map(statuses, 'id'))
  }
}

const clearTagTimeline = (state) => {
  return {
    ...state,
    tag: []
  }
}

const reducers = {
  addStatus,
  addStatuses,
  addStatusIdsToTimeline,
  addStatusesToTimeline,
  cropOlderStatusesFromTimeline,
  deleteStatus,
  addTagTimeline,
  clearTagTimeline
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
  },
  deleteStatus: ({ statusId }) => {
    return {
      type: 'deleteStatus',
      payload: { statusId }
    }
  },
  addTagTimeline: ({ statuses }) => {
    return {
      type: 'addTagTimeline',
      payload: { statuses }
    }
  },
  clearTagTimeline: () => {
    return {
      type: 'clearTagTimeline',
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
