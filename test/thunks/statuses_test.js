import { combineReducers } from 'redux'
import reducers from '../../src/reducers.js'
import statusesThunks from '../../src/thunks/statuses_thunks.js'
import fetchMocker from '../api/fetch_mocker.js'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const reducer = combineReducers({
  statuses: reducers.statuses.reducer,
  users: reducers.users.reducer,
  api: reducers.api.reducer
})

describe('Status thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetches the home timeline and adds the statuses', async () => {
    const store = { state: undefined }
    const timelineName = 'home'
    const type = 'home'

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
      return store.state
    }

    const getState = () => store.state

    const user = {
      id: '1'
    }

    const statuses = [
      { id: '1', account: user },
      { id: '2', account: user }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/timelines/home`,
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/home?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))

    let state = await statusesThunks.fetchAndAddTimeline({ config, timelineName, type })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: statuses[0], 2: statuses[1] })

    expect(state.statuses.timelines.home.statusIds)
      .toEqual(['2', '1'])

    expect(state.api.timelines.home.prev)
      .toEqual({
        'rel': 'prev',
        'since_id': '9gZ5g5Q6RlaAaN9Z5M',
        'url': 'https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M'
      })

    expect(state.users.usersByIds)
      .toEqual({
        [user.id]: user
      })
  })

  it('fetches the public timeline and adds the statuses', async () => {
    const store = { state: undefined }
    const timelineName = 'public'
    const type = 'public'

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
      return store.state
    }

    const getState = () => store.state

    const user = {
      id: '1'
    }

    const statuses = [
      { id: '1', account: user },
      { id: '2', account: user }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/timelines/public`,
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))

    let state = await statusesThunks.fetchAndAddTimeline({ config, timelineName, type })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: statuses[0], 2: statuses[1] })

    expect(state.statuses.timelines.public.statusIds)
      .toEqual(['2', '1'])

    expect(state.api.timelines.public.prev)
      .toEqual({
        'rel': 'prev',
        'since_id': '9gZ5g5Q6RlaAaN9Z5M',
        'url': 'https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M'
      })

    expect(state.users.usersByIds)
      .toEqual({
        [user.id]: user
      })
  })

  it('fetches a timeline by a full url and adds the statuses', async () => {
    const store = { state: undefined }
    const timelineName = 'public'
    const type = 'public'

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
      return store.state
    }

    const getState = () => store.state

    const user = {
      id: '1'
    }

    const statuses = [
      { id: '1', account: user },
      { id: '2', account: user }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/timelines/doesntexist`,
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))

    const fullUrl = 'https://pleroma.soykaf.com/api/v1/timelines/doesntexist'
    let state = await statusesThunks.fetchAndAddTimeline({ config, timelineName, type, fullUrl })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: statuses[0], 2: statuses[1] })

    expect(state.statuses.timelines.public.statusIds)
      .toEqual(['2', '1'])

    expect(state.api.timelines.public.prev)
      .toEqual({
        'rel': 'prev',
        'since_id': '9gZ5g5Q6RlaAaN9Z5M',
        'url': 'https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M'
      })

    expect(state.users.usersByIds)
      .toEqual({
        [user.id]: user
      })
  })

  it('sets next link when getting older statuses', async () => {
    const store = {
      state: {
        api: {
          timelines: {
            public: {
              prev: {},
              next: {}
            }
          }
        }
      }
    }
    const timelineName = 'public'
    const type = 'public'

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
      return store.state
    }

    const getState = () => store.state

    const user = {
      id: '1'
    }

    const statuses = [
      { id: '1', account: user }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/timelines/doesntexist`,
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))

    const fullUrl = 'https://pleroma.soykaf.com/api/v1/timelines/doesntexist'
    let state = await statusesThunks.fetchAndAddTimeline({ config, timelineName, type, fullUrl, older: true })(dispatch, getState)

    expect(state.api.timelines.public.prev).toEqual({})
    expect(state.api.timelines.public.next).toEqual({
      'rel': 'next',
      'max_id': '9gZ5VYhDG8GeCL8Vay',
      'url': 'https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay'
    })
  })

  it('post a new status', async () => {
    const store = {
      state: undefined
    }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
      return store.state
    }

    const getState = () => store.state

    const status = {
      status: 'test text',
      id: '1'
    }

    const statuses = [
      {
        ...status,
        content: undefined,
        spoiler_text: undefined
      }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      status,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/statuses`
      }))

    let state = await statusesThunks.postStatus({ config, params: status })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: statuses[0] })

    expect(state.statuses.timelines.local)
      .toEqual({ statusIds: ['1'] })
  })

  it('fetches a status with its context', async () => {
    const store = { state: undefined }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
      return store.state
    }

    const getState = () => store.state

    const status = {
      id: '1',
      content: 'Status content'
    }
    const context = { ancestors: [], descendants: [] }

    fetch.mockReset()
    fetch
      .mockImplementationOnce(
        fetchMocker(
          status,
          {
            expectedUrl: `https://pleroma.soykaf.com/api/v1/statuses/1`
          })
      )
      .mockImplementationOnce(
        fetchMocker(
          context,
          {
            expectedUrl: `https://pleroma.soykaf.com/api/v1/statuses/1/context`
          })
      )

    let state = await statusesThunks.getStatusWithContext({ config, params: { id: '1' } })(dispatch, getState)

    const result = {
      id: '1',
      content: 'Status content',
      spoiler_text: undefined,
      context: {
        ancestors: [],
        descendants: []
      }
    }

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: result })
  })
})
