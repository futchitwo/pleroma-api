import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import notificationsThunks from '../../src/thunks/notifications_thunks'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const reducer = combineReducers({
  api: reducers.api.reducer,
  notifications: reducers.notifications.reducer
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
})
