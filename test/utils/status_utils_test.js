import * as StatusUtils from '../../src/utils/status_utils'

describe('status utils', () => {
  describe('addStatusIds', () => {
    it('should add ids and reverse sort them', () => {
      const oldIds = ['b', 'c', 'd']
      const newIds = ['a', 'e']
      const expected = ['e', 'd', 'c', 'b', 'a']
      expect(StatusUtils.addStatusIds(oldIds, newIds)).toEqual(expected)
    })

    it('should only keep unique ids', () => {
      const oldIds = ['b', 'c']
      const newIds = ['c', 'e']
      const expected = ['e', 'c', 'b']
      expect(StatusUtils.addStatusIds(oldIds, newIds)).toEqual(expected)
    })
  })
})
