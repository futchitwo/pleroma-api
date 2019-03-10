import statuses from '../../src/reducers/statuses.js'

describe('Status reducers', () => {
  describe('adding statuses', () => {
    it('adds a new status by id', () => {
      const status = {id: "123"}
      const resultState = statuses.reducer(undefined, statuses.actions.addStatus({status}))
      expect(resultState.statusesByIds).toEqual({"123": status})
    })

    it('merges new information in', () => {
      const status = {id: "123", info: "oneinfo", other: "info"}
      let resultState = statuses.reducer(undefined, statuses.actions.addStatus({status}))
      const updatedStatus = {id: "123", info: "someinfo"}
      resultState = statuses.reducer(resultState, statuses.actions.addStatus({status: updatedStatus}))
      expect(resultState.statusesByIds).toEqual({"123": {id: "123", info: "someinfo", other: "info"}})
    })
  })
})
