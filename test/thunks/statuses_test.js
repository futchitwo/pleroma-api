import { combineReducers } from 'redux'
import reducers from '../../src/reducers.js'
import statusesThunks from '../../src/thunks/statuses_thunks.js'
import fetchMocker from '../api/fetch_mocker.js'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const reducer = combineReducers({
  statuses: reducers.statuses.reducer,
  conversations: reducers.conversations.reducer,
  users: reducers.users.reducer,
  api: reducers.api.reducer
})

const dispatch = (store = { state: undefined }) => (action) => {
  store.state = reducer(store.state, action)
  return store.state
}

const getState = (store) => () => store.state

describe('Status thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }
  let store = { state: undefined }

  it('fetches the home timeline and adds the statuses', async () => {
    const store = { state: undefined }
    const timelineName = 'home'
    const type = 'home'
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
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/timelines/home',
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/home?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))

    const state = await statusesThunks.fetchAndAddTimeline({ config, timelineName, type })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: statuses[0], 2: statuses[1] })

    expect(state.statuses.timelines.home.statusIds)
      .toEqual(['2', '1'])

    expect(state.api.timelines.home.prev)
      .toEqual({
        rel: 'prev',
        since_id: '9gZ5g5Q6RlaAaN9Z5M',
        url: 'https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M'
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
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/timelines/public',
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))

    const state = await statusesThunks.fetchAndAddTimeline({ config, timelineName, type })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: statuses[0], 2: statuses[1] })

    expect(state.statuses.timelines.public.statusIds)
      .toEqual(['2', '1'])

    expect(state.api.timelines.public.prev)
      .toEqual({
        rel: 'prev',
        since_id: '9gZ5g5Q6RlaAaN9Z5M',
        url: 'https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M'
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
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/timelines/doesntexist',
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))

    const fullUrl = 'https://pleroma.soykaf.com/api/v1/timelines/doesntexist'
    const state = await statusesThunks.fetchAndAddTimeline({ config, timelineName, type, fullUrl })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: statuses[0], 2: statuses[1] })

    expect(state.statuses.timelines.public.statusIds)
      .toEqual(['2', '1'])

    expect(state.api.timelines.public.prev)
      .toEqual({
        rel: 'prev',
        since_id: '9gZ5g5Q6RlaAaN9Z5M',
        url: 'https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M'
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
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/timelines/doesntexist',
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))

    const fullUrl = 'https://pleroma.soykaf.com/api/v1/timelines/doesntexist'
    const state = await statusesThunks.fetchAndAddTimeline({ config, timelineName, type, fullUrl, older: true })(dispatch(store), getState(store))

    expect(state.api.timelines.public.prev).toEqual({})
    expect(state.api.timelines.public.next).toEqual({
      rel: 'next',
      max_id: '9gZ5VYhDG8GeCL8Vay',
      url: 'https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay'
    })
  })

  it('shortens the length of timeline and removes next', async () => {
    const store = {
      state: {
        api: {
          timelines: {
            public: {
              prev: {},
              next: 'test'
            }
          }
        },
        statuses: {
          timelines: {
            public: {
              statusIds: [
                '4',
                '3',
                '2',
                '1',
                '0'
              ]
            }
          }
        }
      }
    }
    const timelineName = 'public'

    const state = await statusesThunks.cropOlderStatusesFromTimeline({ timelineName, length: 3 })(dispatch(store), getState(store))

    expect(state.statuses.timelines.public.statusIds).toEqual(['4', '3', '2'])
    expect(state.api.timelines.public.next).toEqual(null)
  })

  it('keeps timeline the same when less statuses than length', async () => {
    store = {
      state: {
        api: {
          timelines: {
            public: {
              prev: {},
              next: 'test'
            }
          }
        },
        statuses: {
          timelines: {
            public: {
              statusIds: [
                '4'
              ]
            }
          }
        }
      }
    }
    const timelineName = 'public'

    const state = await statusesThunks.cropOlderStatusesFromTimeline({ timelineName, length: 3 })(dispatch(store), getState(store))

    expect(state.statuses.timelines.public.statusIds).toEqual(['4'])
    expect(state.api.timelines.public.next).toEqual(null)
  })

  it('post a new status', async () => {
    const store = { state: undefined }
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
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses'
      }))

    const state = await statusesThunks.postStatus({ config, params: status })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: statuses[0] })

    expect(state.statuses.timelines.local)
      .toEqual({ statusIds: ['1'] })
  })

  it('post status to conversation', async () => {
    const store = { state: undefined }
    const conversation = {
      id: 'id',
      last_status: { id: '1', status: 'aaa' }
    }
    const status = { id: '1', status: 'aaa' }

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      status,
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses'
      }))
      .mockImplementationOnce(fetchMocker(
        [status],
        {
          expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/conversations/id/statuses'
        }
      ))

    const state = await statusesThunks.postStatus({ config, params: status, conversationId: 'id' })(dispatch(store), getState(store))

    expect(state.conversations.conversationsByIds)
      .toEqual({ id: { ...conversation, last_status: status, timeline: [{ id: '1', status: 'aaa' }] } })
  })

  it('favourite status', async () => {
    const store = {
      state: {
        statuses: {
          statusesByIds: { 1: { id: '1', content: '', favourited: false } }
        }
      }
    }
    const id = '1'
    const status = {
      content: 'test text',
      id,
      favourited: true
    }

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      status,
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/favourite'
      }))

    const state = await statusesThunks.toggleFavouritedStatus({ config, params: { id }, favourited: false })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: { ...status, favourited: true } })
  })

  it('unfavourite status', async () => {
    const store = {
      state: {
        statuses: { statusesByIds: { 1: { id: '1', content: '', favourited: true } } }
      }
    }
    const id = '1'
    const status = {
      content: 'test text',
      id,
      favourited: false
    }

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      status,
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/unfavourite'
      }))

    const state = await statusesThunks.toggleFavouritedStatus({ config, params: { id }, favourited: true })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: { ...status, favourited: false } })
  })

  it('reblog status', async () => {
    const id = '1'
    const status = {
      content: 'test text',
      id,
      reblogged: false
    }
    const user = {
      id: 'user1'
    }
    const store = {
      state: {
        statuses: {
          statusesByIds: { 1: status }
        }
      }
    }

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      { content: 'test text', id: '2', reblog: status },
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/reblog'
      }))

    const state = await statusesThunks.toggleRebloggedStatus({ config, params: { id }, reblogged: false, user })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: { ...status, reblogged: true, reblogs_count: 1, reblogged_by: [user] } })
  })

  it('unreblog status', async () => {
    const id = '1'
    const user = { id: 'user2' }
    const status = { id: '1', content: 'content', reblogged: true, reblogs_count: 1, reblogged_by: [user], account: { id: 'user1' } }
    const store = {
      state: {
        statuses:
      {
        statusesByIds: {
          1: status,
          2: { id: '2', reblog: status, account: user }
        }
      }
      }
    }

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      {},
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/unreblog'
      }))

    const state = await statusesThunks.toggleRebloggedStatus({ config, params: { id }, reblogged: true, user })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: { ...status, reblogged: false, reblogs_count: 0 } })
  })

  it('mute status', async () => {
    const store = {
      state: {
        statuses: {
          statusesByIds: { 1: { id: '1', content: '', muted: false } }
        }
      }
    }
    const id = '1'
    const status = {
      content: 'test text',
      id,
      muted: true
    }

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      status,
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/mute'
      }))

    const state = await statusesThunks.toggleMutedStatus({ config, params: { id }, muted: false })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: { ...status, muted: true } })
  })

  it('unmute status', async () => {
    const store = {
      state: {
        statuses:
        { statusesByIds: { 1: { id: '1', content: '', muted: true } } }
      }
    }
    const id = '1'
    const status = {
      content: 'test text',
      id,
      muted: false
    }

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      status,
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/unmute'
      }))

    const state = await statusesThunks.toggleMutedStatus({ config, params: { id }, muted: true })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: { ...status, muted: false } })
  })

  it('fetches a status with its context', async () => {
    const store = { state: undefined }
    const status = {
      id: '1',
      content: 'Status content'
    }
    const context = {
      ancestors: [{ id: '2', content: '', spoiler_text: '' }],
      descendants: [{ id: '3', content: '', spoiler_text: '' }]
    }

    fetch.mockReset()
    fetch
      .mockImplementationOnce(
        fetchMocker(
          status,
          {
            expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1'
          })
      )
      .mockImplementationOnce(
        fetchMocker(
          context,
          {
            expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/context'
          })
      )

    const state = await statusesThunks.getStatusWithContext({ config, params: { id: '1' } })(dispatch(store), getState(store))

    const result = {
      id: '1',
      content: 'Status content',
      spoiler_text: undefined,
      context: {
        ancestors: [{ id: '2', content: '', spoiler_text: '' }],
        descendants: [{ id: '3', content: '', spoiler_text: '' }]
      }
    }

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: result })
  })

  it('fetches a status\' lists', async () => {
    const store = {
      state: {
        statuses:
      {
        statusesByIds: {
          1: {
            id: '1',
            content: 'Status content',
            spoiler_text: ''
          }
        }
      }
      }
    }
    const favouritedByList = [{ id: 1 }, { id: 2 }]
    const rebloggedByList = [{ id: 3 }, { id: 4 }]
    fetch.mockReset()
    fetch
      .mockImplementationOnce(
        fetchMocker(
          favouritedByList,
          {
            expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/favourited_by'
          })
      )
      .mockImplementationOnce(
        fetchMocker(
          rebloggedByList,
          {
            expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/reblogged_by'
          })
      )

    const state = await statusesThunks.getStatusLists({ config, params: { id: '1' } })(dispatch(store), getState(store))

    const result = {
      id: '1',
      content: 'Status content',
      spoiler_text: '',
      favourited_by: favouritedByList,
      reblogged_by: rebloggedByList,
      reblogs_count: 2,
      favourites_count: 2
    }

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: result })
  })
  it('fetches a status\' lists in user timeline', async () => {
    const store = {
      state: {
        users: {
          usersByIds: {
            1: {
              id: '1',
              acct: 'nd',
              statuses: [
                { id: '1', content: 'Status content', spoiler_text: '', reblogged: false }
              ]
            }
          }
        }
      }
    }
    const favouritedByList = [{ id: 1 }, { id: 2 }]
    const rebloggedByList = [{ id: 3 }, { id: 4 }]
    fetch.mockReset()
    fetch
      .mockImplementationOnce(
        fetchMocker(
          favouritedByList,
          {
            expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/favourited_by'
          })
      )
      .mockImplementationOnce(
        fetchMocker(
          rebloggedByList,
          {
            expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/reblogged_by'
          })
      )

    const state = await statusesThunks.getStatusLists({ config, params: { id: '1', userId: 1 } })(dispatch(store), getState(store))

    const result = {
      id: '1',
      acct: 'nd',
      statuses: [
        {
          id: '1',
          content: 'Status content',
          spoiler_text: '',
          reblogged: false,
          favourited_by: favouritedByList,
          reblogged_by: rebloggedByList,
          reblogs_count: 2,
          favourites_count: 2
        }
      ]
    }

    expect(state.users.usersByIds)
      .toEqual({ 1: result })
  })

  it('delete status', async () => {
    const status = {
      id: '1',
      content: 'Status content'
    }
    const store = { state: { statuses: { statusesByIds: { 1: status } } } }

    fetch.mockReset()
    fetch
      .mockImplementationOnce(
        fetchMocker(
          status,
          {
            expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1'
          })
      )

    const state = await statusesThunks.deleteStatus({ config, params: { id: '1' } })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({})
  })

  it('delete status from user profile', async () => {
    const status = {
      id: '1',
      content: 'Status content'
    }
    const user = {
      id: '2',
      acct: 'nd',
      statuses: [status]
    }
    const store = {
      state: {
        statuses: { statusesByIds: { 1: status } },
        users: { usersByIds: { 2: user } }
      }
    }

    fetch.mockReset()
    fetch
      .mockImplementationOnce(
        fetchMocker(
          status,
          {
            expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1'
          })
      )

    const state = await statusesThunks.deleteStatus({ config, params: { id: '1', userId: '2' } })(dispatch(store), getState(store))

    expect(state.statuses.statusesByIds)
      .toEqual({})
    expect(state.users.usersByIds)
      .toEqual({ 2: { id: '2', acct: 'nd', statuses: [] } })
  })
})
