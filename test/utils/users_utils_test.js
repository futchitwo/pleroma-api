import * as UsersUtils from '../../src/utils/users_utils'

describe('users utils', () => {
  describe('get  users from statuses list', () => {
    it('should add ids and reverse sort them', () => {
      const statuses = [
        { id: 0, account: { id: 0 } },
        { id: 1, account: { id: 1 }, reblog: { account: { id: 2} } }
      ]
      const expected = [{ id: 0 }, { id: 1 }, { id: 2 }]
      expect(UsersUtils.getUsersFromStatusesList(statuses)).toEqual(expected)
    })
  })
})
