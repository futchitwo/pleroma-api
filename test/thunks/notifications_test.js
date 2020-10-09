import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import notificationsThunks from '../../src/thunks/notifications_thunks'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const reducer = combineReducers({
  api: reducers.api.reducer,
  notifications: reducers.notifications.reducer,
  users: reducers.users.reducer,
})

describe('Notifications thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetch notifications', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const notifications = [
      {
        id: '16',
        type: 'follow'
      },
      {
        id: '18',
        type: 'favourite'
      }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      notifications,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/notifications`,
        headers: {
          link: `<https://pleroma.soykaf.com/api/v1/notifications?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/notifications?min_id=16>; rel="prev"`
        }
      }
    ))

    let state = await notificationsThunks.fetch({ config })(dispatch, getState)

    expect(state.notifications.notificationsByIds)
      .toEqual({ 16: notifications[0], 18: notifications[1] })

    expect(state.notifications.list)
      .toEqual(['16', '18'])

    expect(state.api.notifications.prev)
      .toEqual({
        rel: 'prev',
        min_id: '16',
        url: 'https://pleroma.soykaf.com/api/v1/notifications?min_id=16'
      })
  })

  it('fetcher a notifications by a full url', async () => {
    const store = { state: undefined }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const notifications = [
      {
        id: '16',
        type: 'follow'
      },
      {
        id: '18',
        type: 'favourite'
      }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      notifications,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/notifications`,
        headers: {
          link: `<https://pleroma.soykaf.com/api/v1/notifications?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/notifications?min_id=16>; rel="prev"`
        }
      }
    ))

    const fullUrl = 'https://pleroma.soykaf.com/api/v1/notifications'

    let state = await notificationsThunks.fetch({ config, fullUrl })(dispatch, getState)
    expect(state.notifications.notificationsByIds)
      .toEqual({ 16: notifications[0], 18: notifications[1] })

    expect(state.notifications.list)
      .toEqual(['16', '18'])

    expect(state.api.notifications.prev)
      .toEqual({
        rel: 'prev',
        min_id: '16',
        url: 'https://pleroma.soykaf.com/api/v1/notifications?min_id=16'
      })
  })

  it('dismiss a single notification', async () => {
    const store = { state: {
      notifications: {
        notificationsByIds: {
          '1': { id: '1', pleroma: { is_seen: false } }
        },
        list: ['1']
      }
    } }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      {},
      { expectedUrl: `https://pleroma.soykaf.com/api/v1/notifications/dismiss` }
    ))

    let state = await notificationsThunks.dismiss({ config, params:{ id: '1' } })(dispatch, getState)
    expect(state.notifications.notificationsByIds)
      .toEqual({ 1: { id: '1', pleroma: { is_seen: true } } })

    expect(state.notifications.list)
      .toEqual(['1'])
  })

  it('dismiss all notifications', async () => {
    const store = { state: {
      notifications: {
        notificationsByIds: {
          '1': { id: '1', pleroma: { is_seen: false } }
        },
        list: ['1']
      }
    } }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      {},
      { expectedUrl: `https://pleroma.soykaf.com/api/v1/notifications/clear` }
    ))

    let state = await notificationsThunks.dismissAll({ config })(dispatch, getState)
    expect(state.notifications.notificationsByIds)
      .toEqual({ 1: { id: '1', pleroma: { is_seen: true } } })

    expect(state.notifications.list)
      .toEqual(['1'])
  })

  it('read single notification', async () => {
    const store = { state: {
      notifications: {
        notificationsByIds: {
          '1': { id: '1', pleroma: { is_seen: false } },
          '2': { id: '2', pleroma: { is_seen: false } }
        },
        list: ['1', '2']
      },
      users: {
        currentUser: {
          id: '3',
          pleroma: {
            unread_notifications_count: 3
          }
        }
      }
    } }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      {},
      { expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/notifications/read` }
    ))
    let state = await notificationsThunks.read({ config, params:{ id: '1' } })(dispatch, getState)
    expect(state.notifications.notificationsByIds)
      .toEqual({
        1: { id: '1', pleroma: { is_seen: true } },
        2: { id: '2', pleroma: { is_seen: false } }
      })

    expect(state.notifications.list)
      .toEqual(['1', '2'])
    expect(state.users.currentUser.pleroma.unread_notifications_count)
      .toEqual(2)
  })

  it('read all notification', async () => {
    const store = { state: {
      notifications: {
        notificationsByIds: {
          '1': { id: '1', pleroma: { is_seen: false } }
        },
        list: ['1']
      },
      users: {
        currentUser: {
          id: '2',
          pleroma: { unread_notifications_count: 3 }
        }
      }
    } }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      {},
      { expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/notifications/read` }
    ))

    let state = await notificationsThunks.read({ config, params:{ max_id: '1' } })(dispatch, getState)
    expect(state.notifications.notificationsByIds)
      .toEqual({ 1: { id: '1', pleroma: { is_seen: true } } })

    expect(state.notifications.list)
      .toEqual(['1'])
    expect(state.users.currentUser.pleroma.unread_notifications_count)
      .toEqual(0)
  })
})
