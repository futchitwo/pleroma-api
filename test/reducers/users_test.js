import Users from '../../src/reducers/users.js'

describe('User reducers', () => {
  describe('adding Users', () => {
    it('add new user', () => {
      const user = { id: '1', username: 'user' }

      const resultState = Users.reducer(
        undefined,
        Users.actions.addUser({ user })
      )

      expect(resultState.usersByIds).toEqual({ '1': user })
    })

    it('update user', () => {
      const user = { id: '1', username: 'user', note: 'note' }

      const defaultState = {
        usersByIds: {
          1: { id: '1', username: 'user' }
        }
      }
      const resultState = Users.reducer(
        defaultState,
        Users.actions.addUser({ user })
      )

      expect(resultState.usersByIds).toEqual({ '1': user })
    })

    it('adds new users by id', () => {
      const users = [{ id: '1' }, { id: '2' }]

      const resultState = Users.reducer(
        undefined,
        Users.actions.addUsers({ users })
      )

      expect(resultState.usersByIds).toEqual(
        {
          '1': { id: '1' },
          '2': { id: '2' }
        }
      )
    })

    it('merges new information in', () => {
      const users = [{ id: '1', name: 'lain', bio: 'hi' }, { id: '2' }]

      const resultState = Users.reducer(
        undefined,
        Users.actions.addUsers({ users })
      )

      const updatedUser = {
        id: '1',
        bio: 'oof'
      }

      const updatedState = Users.reducer(
        resultState,
        Users.actions.addUsers({ users: [updatedUser] })
      )

      expect(updatedState.usersByIds['1'])
        .toEqual({
          id: '1',
          name: 'lain',
          bio: 'oof'
        })
    })
  })

  describe('setting a current user', () => {
    it('sets a current user', () => {
      const user = { id: '1' }

      const resultState = Users.reducer(
        undefined,
        Users.actions.setCurrentUser({ user })
      )

      expect(resultState.currentUser).toEqual(user)
    })

    it('update a current user', () => {
      const user = { id: '1' }
      const resultUser = { id: '1', name: 'user' }

      const resultState = Users.reducer(
        { currentUser: user },
        Users.actions.updateCurrentUser({ name: 'user' })
      )

      expect(resultState.currentUser).toEqual(resultUser)
    })
  })

  
  describe(`adding a user's statuses`, () => {
    it('add statuses no a new user', () => {
      const user = { id: '1' }
      const statuses = [{ id: 2, content: 'b' }, { id: 1, content: 'a' }]
      const resultState = Users.reducer(
        undefined,
        Users.actions.addUserStatuses({ userId: user.id, statuses })
      )

      expect(resultState.usersByIds['1']).toEqual({ statuses })
    })

    it('update user statuses', () => {
      const user = { id: '1' }
      const statuses = [{ id: 2, content: 'b' }, { id: 1, content: 'a' }]

      const resultState = Users.reducer(
        { usersByIds: { 1: user } },
        Users.actions.addUserStatuses({ userId: user.id, statuses })
      )

      expect(resultState.usersByIds['1']).toEqual({ ...user, statuses })
    })

    it('delete user status', () => {
      const statuses = [{ id: 2, content: 'b' }, { id: 1, content: 'a' }]
      const user = { id: '1', statuses: [ ...statuses ] }

      const resultState = Users.reducer(
        { usersByIds: { 1: user } },
        Users.actions.deleteUserStatus({ userId: user.id, statusId: 1 })
      )

      expect(resultState.usersByIds['1']).toEqual({ ...user, statuses: [{ id: 2, content: 'b' }] })
    })
    it('update unread notifications count', () => {
      const currentUser = { id: '1', pleroma: { unread_notifications_count: 5 } }

      const resultState = Users.reducer(
        { currentUser },
        Users.actions.updateUnreadNotificationsCount({ unreadNotificationsCount: 1 })
      )

      expect(resultState.currentUser).toEqual({ id: '1', pleroma: { unread_notifications_count: 1 } })
    })
  })
})
