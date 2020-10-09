import Notifications from '../../src/reducers/notifications.js'

describe('Notifications reducers', () => {
  it('adds a new notification by id', () => {
    const notification = { id: '123' }
    const resultState = Notifications.reducer(undefined, Notifications.actions.addNotification({ notification }))

    expect(resultState.notificationsByIds).toEqual({ 123: notification })
    expect(resultState.list).toEqual(['123'])
  })

  it('adds in the front, keeps it unique', async () => {
    const notificationIds = ['1', '2', '3']
    let resultState = Notifications.reducer(undefined, Notifications.actions.addNotificationIds({ notificationIds }))
    const moreNotificationIds = ['4', '2', '3']

    resultState = Notifications.reducer(resultState, Notifications.actions.addNotificationIds({ notificationIds: moreNotificationIds }))

    expect(resultState.list).toEqual(['4', '2', '3', '1'])
  })

  it('adds notifications', async () => {
    const notifications = [{ id: '1' }, { id: '2' }, { id: '3' }]
    const resultState = Notifications.reducer(undefined, Notifications.actions.addNotifications({ notifications }))

    expect(resultState.list).toEqual(['1', '2', '3'])
    expect(resultState.notificationsByIds).toEqual({ 1: notifications[0], 2: notifications[1], 3: notifications[2] })
  })

  it('merges new notifications', () => {
    const notification = { id: '123', type: 'follow' }
    let resultState = Notifications.reducer(undefined, Notifications.actions.addNotifications({ notification }))
    const updatedNotification = { id: '123', type: 'follow', pleroma: {} }

    resultState = Notifications.reducer(resultState, Notifications.actions.addNotification({ notification: updatedNotification }))

    expect(resultState.notificationsByIds).toEqual({ '123': { id: '123', type: 'follow', pleroma: {}, account: null } })
  })

  it('adds notification ids', async () => {
    const notificationIds = ['1', '2', '3']
    const resultState = Notifications.reducer(undefined, Notifications.actions.addNotificationIds({ notificationIds }))

    expect(resultState.list).toEqual(notificationIds)
  })

  it('clear notifications', async () => {
    const initState = {
      list: ['1', '2'],
      notificationsByIds: {
        1: { id: '1' },
        2: { id: '2' }
      }
    }
    const resultState = Notifications.reducer(initState, Notifications.actions.clearNotifications())

    expect(resultState.list).toEqual([])
    expect(resultState.notificationsByIds).toEqual({})
  })

  it('dismiss single notification', async () => {
    const initState = {
      list: ['1', '2'],
      notificationsByIds: {
        1: { id: '1', pleroma: { is_seen: false } },
        2: { id: '2' }
      }
    }
    const resultState = Notifications.reducer(initState, Notifications.actions.read({ notificationId: '1' }))

    expect(resultState.list).toEqual(['1', '2'])
    expect(resultState.notificationsByIds).toEqual({ 1: { id: '1', pleroma: { is_seen: true } }, 2: { id: '2' } })
  })

  it('read all notifications', async () => {
    const initState = {
      list: ['1', '2'],
      notificationsByIds: {
        1: { id: '1', pleroma: { is_seen: false } },
        2: { id: '2', pleroma: { is_seen: false } }
      }
    }
    const resultState = Notifications.reducer(initState, Notifications.actions.readAll())

    expect(resultState.list).toEqual(['1', '2'])
    expect(resultState.notificationsByIds).toEqual({
      1: { id: '1', pleroma: { is_seen: true } },
      2: { id: '2', pleroma: { is_seen: true } } })
  })
})
