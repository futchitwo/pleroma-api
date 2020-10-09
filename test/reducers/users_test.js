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
  })

  describe(`update user status`, () => {
    it('should update user status', () => {
      const status = { id: '2', content: 'content', spoiler_text: 'header', avatar: 'nd' }
      const user = {
        id: '1',
        statuses: [status]
      }

      const resultState = Users.reducer(
        { usersByIds: { '1': user } },
        Users.actions.updateUserStatus({ userId: '1', status: { ...status, followed_by: [{ id: 'f1' }] } })
      )

      expect(resultState.usersByIds['1']).toEqual({ id: '1', statuses: [{...status, followed_by: [{ id: 'f1' }] }] })
    })
    it(`should set status, if it wasn't exist`, () => {
      const status = { id: '2', content: 'content', spoiler_text: 'header' }
      const user = {
        id: '1'
      }

      const resultState = Users.reducer(
        { usersByIds: { '1': user } },
        Users.actions.updateUserStatus({ userId: '1', status: { ...status, followed_by: [{ id: 'f1' }] } })
      )

      expect(resultState.usersByIds['1']).toEqual({ id: '1', statuses: [{...status, followed_by: [{ id: 'f1' }] }] })
    })
  }) 

  describe(`adding a user's followers`, () => {
    it('add followersIds no a new user', () => {
      const followers = [{ id: 2, acct: 'b' }, { id: 1, acct: 'a' }]
      const resultState = Users.reducer(
        undefined,
        Users.actions.addUserFollowers({ userId: '1', followers })
      )

      expect(resultState.usersByIds['1']).toEqual({ followers: [2, 1] })
    })

    it('update user followersIds', () => {
      const user = { id: 1 }
      const followers = [{ id: 2, acct: 'b' }, { id: 1, acct: 'a' }]
      const resultState = Users.reducer(
        { usersByIds: { 1: user } },
        Users.actions.addUserFollowers({ userId: user.id, followers  })
      )

      expect(resultState.usersByIds['1']).toEqual({ ...user, followers: [2, 1] })
    })
  })


  describe(`adding a user's following`, () => {
    it('add followingIds no a new user', () => {
      const following = [{ id: 2, acct: 'b' }, { id: 1, acct: 'a' }]
      const resultState = Users.reducer(
        undefined,
        Users.actions.addUserFollowing({ userId: '1', following })
      )

      expect(resultState.usersByIds['1']).toEqual({ following: [2, 1] })
    })

    it('update user followingIds', () => {
      const user = { id: 1 }
      const following = [{ id: 2, acct: 'b' }, { id: 1, acct: 'a' }]
      const resultState = Users.reducer(
        { usersByIds: { 1: user } },
        Users.actions.addUserFollowing({ userId: user.id, following  })
      )

      expect(resultState.usersByIds['1']).toEqual({ ...user, following: [2, 1] })
    })
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
