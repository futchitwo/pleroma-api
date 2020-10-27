import { map, reduce, uniq, values } from 'lodash'
import { emojifyAccount } from '../utils/parse_utils'

const initialState = {
  list: [],
  followRequestsByIds: {},
  unprocessedRequestsCount: 0
}

const addFollowRequests = (state, { followRequests }) => {
  const newFollowRequests = reduce(followRequests, (result, followRequest) => {
    const oldFollowRequest = state.followRequestsByIds[followRequest.id] || {}
    followRequest = emojifyAccount(followRequest, oldFollowRequest)
    const newFollowRequest = { ...oldFollowRequest, ...followRequest }
    if (!newFollowRequest.pleroma || !newFollowRequest.pleroma.relationship) {
      newFollowRequest.pleroma = { relationship: { requested: true } }
    }
    result[followRequest.id] = newFollowRequest
    return result
  }, {})
  const followRequestsByIds = {
    ...state.followRequestsByIds,
    ...newFollowRequests
  }
  const unprocessedRequestsCount = values(followRequestsByIds).reduce((result, followRequest) => {
    if (followRequest.pleroma.relationship.requested || !Object.prototype.hasOwnProperty.call(followRequest.pleroma.relationship, 'requested')) {
      return result + 1
    }
    return result
  }, 0)
  const newState = {
    ...state,
    followRequestsByIds,
    unprocessedRequestsCount
  }
  const followRequestIds = map(followRequests, 'id')

  return addFollowRequestIds(newState, { followRequestIds })
}

const addFollowRequestIds = (state, { followRequestIds }) => ({
  ...state,
  list: uniq([...followRequestIds, ...state.list])
})

const clearFollowRequests = () => ({ ...initialState })

const processFollowRequest = (state, { id, relationship }) => {
  const followRequest = state.followRequestsByIds[id]
  if (!followRequest) return state

  return {
    ...state,
    followRequestsByIds: {
      ...state.followRequestsByIds,
      [id]: {
        ...state.followRequestsByIds[id],
        ...followRequest,
        pleroma: { ...followRequest.pleroma, relationship }
      }
    },
    unprocessedRequestsCount: state.unprocessedRequestsCount - 1
  }
}

const reducers = {
  addFollowRequests,
  addFollowRequestIds,
  clearFollowRequests,
  processFollowRequest
}

const actions = {
  addFollowRequests: ({ followRequests }) => ({
    type: 'addFollowRequests',
    payload: { followRequests }
  }),
  addFollowRequestIds: ({ followRequestIds }) => ({
    type: 'addFollowRequestIds',
    payload: { followRequestIds }
  }),
  clearFollowRequests: () => ({
    type: 'clearFollowRequests'
  }),
  processFollowRequest: ({ id, relationship }) => ({
    type: 'processFollowRequest',
    payload: { id, relationship }
  })
}

const reducer = (state = initialState, action) => {
  const fn = reducers[action.type] || ((state) => state)
  return fn(state, action.payload)
}

export default {
  reducer,
  actions
}
