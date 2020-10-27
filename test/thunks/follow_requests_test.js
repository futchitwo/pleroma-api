import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import followRequestsThunks from '../../src/thunks/follow_requests_thunks'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const defaultRelationship = { pleroma: { relationship: { requested: true } } }

const reducer = combineReducers({
  api: reducers.api.reducer,
  followRequests: reducers.followRequests.reducer
})

describe('Follow requests thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetch pending follow requests', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const followRequests = [
      { id: '16' },
      { id: '18' }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      followRequests,
      { expectedUrl: 'https://pleroma.soykaf.com/api/v1/follow_requests' }
    ))

    const state = await followRequestsThunks.fetch({ config })(dispatch, getState)

    expect(state.followRequests.followRequestsByIds)
      .toEqual({
        16: { ...followRequests[0], ...defaultRelationship },
        18: { ...followRequests[1], ...defaultRelationship }
      })
    expect(state.followRequests.list)
      .toEqual(['16', '18'])
    expect(state.followRequests.unprocessedRequestsCount)
      .toEqual(2)
  })

  it('accept a follow request', async () => {
    const store = {
      state: {
        followRequests: {
          followRequestsByIds: {
            1: { id: '1' }
          },
          list: ['1'],
          unprocessedRequestsCount: 1
        }
      }
    }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      { requested: true },
      { expectedUrl: 'https://pleroma.soykaf.com/api/v1/follow_requests/1/authorize' }
    ))

    const state = await followRequestsThunks.accept({ config, params: { id: '1' } })(dispatch, getState)
    expect(state.followRequests.followRequestsByIds)
      .toEqual({ 1: { id: '1', pleroma: { relationship: { requested: true } } } })
    expect(state.followRequests.list)
      .toEqual(['1'])
    expect(state.followRequests.unprocessedRequestsCount)
      .toEqual(0)
  })

  it('reject a follow request', async () => {
    const store = {
      state: {
        followRequests: {
          followRequestsByIds: {
            1: { id: '1' },
            2: { id: '2' }
          },
          list: ['1', '2'],
          unprocessedRequestsCount: 2
        }
      }
    }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      { requested: true },
      { expectedUrl: 'https://pleroma.soykaf.com/api/v1/follow_requests/1/reject' }
    ))
    const state = await followRequestsThunks.reject({ config, params: { id: '1' } })(dispatch, getState)
    expect(state.followRequests.followRequestsByIds)
      .toEqual({
        1: { id: '1', pleroma: { relationship: { requested: true } } },
        2: { id: '2' }
      })
    expect(state.followRequests.list)
      .toEqual(['1', '2'])
    expect(state.followRequests.unprocessedRequestsCount)
      .toEqual(1)
  })

  it('update list after reject', async () => {
    const store = {
      state: {
        followRequests: {
          followRequestsByIds: {
            1: { id: '1', ...defaultRelationship },
            2: { id: '2', ...defaultRelationship }
          },
          list: ['1', '2'],
          unprocessedRequestsCount: 2
        }
      }
    }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        { requested: false },
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/follow_requests/1/reject' }
      ))
      .mockImplementationOnce(fetchMocker(
        [],
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/follow_requests' }
      ))
    store.state = await followRequestsThunks.reject({ config, params: { id: '1' } })(dispatch, getState)
    expect(store.state.followRequests.followRequestsByIds)
      .toEqual({
        1: { id: '1', pleroma: { relationship: { requested: false } } },
        2: { id: '2', ...defaultRelationship }
      })
    expect(store.state.followRequests.list)
      .toEqual(['1', '2'])
    expect(store.state.followRequests.unprocessedRequestsCount)
      .toEqual(1)
    store.state = await followRequestsThunks.fetch({ config })(dispatch, getState)

    expect(store.state.followRequests.followRequestsByIds)
      .toEqual({
        1: { id: '1', pleroma: { relationship: { requested: false } } },
        2: { id: '2', ...defaultRelationship }
      })
    expect(store.state.followRequests.list)
      .toEqual(['1', '2'])
    expect(store.state.followRequests.unprocessedRequestsCount)
      .toEqual(1)
  })
})
