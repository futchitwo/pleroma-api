import * as CommonUtils from '../../src/utils/common_utils'

describe('common utils', () => {
  describe('addIdsToList', () => {
    it('should add ids and reverse sort them', () => {
      const oldIds = ['b', 'c', 'd']
      const newIds = ['a', 'e']
      const expected = ['e', 'd', 'c', 'b', 'a']
      expect(CommonUtils.addIdsToList(oldIds, newIds)).toEqual(expected)
    })

    it('should only keep unique ids', () => {
      const oldIds = ['b', 'c']
      const newIds = ['c', 'e']
      const expected = ['e', 'c', 'b']
      expect(CommonUtils.addIdsToList(oldIds, newIds)).toEqual(expected)
    })
  })
})
