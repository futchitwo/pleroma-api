import Statuses from '../../src/reducers/statuses.js'

describe('Status reducers', () => {
  describe('adding Statuses', () => {
    it('adds a new status by id', () => {
      const status = { id: '123' }
      const resultState = Statuses.reducer(undefined, Statuses.actions.addStatus({ status }))
      expect(resultState.statusesByIds).toEqual({ '123': status })
    })

    it('merges new information in', () => {
      const status = { id: '123', info: 'oneinfo', other: 'info' }
      let resultState = Statuses.reducer(undefined, Statuses.actions.addStatus({ status }))
      const updatedStatus = { id: '123', info: 'someinfo' }
      resultState = Statuses.reducer(resultState, Statuses.actions.addStatus({ status: updatedStatus }))
      expect(resultState.statusesByIds).toEqual({ '123': { id: '123', info: 'someinfo', other: 'info' } })
    })
  })

  describe('timelines', () => {
    it('adds status ids to a timeline', async () => {
      const statusIds = ['1', '2', '3']
      const timelineName = 'test'

      const resultState = Statuses.reducer(undefined, Statuses.actions.addStatusIdsToTimeline({ statusIds, timelineName }))

      expect(resultState.timelines[timelineName].statusIds).toEqual(statusIds)
    })

    it('adds in the front, keeps it unique', async () => {
      const statusIds = ['1', '2', '3']
      const timelineName = 'test'

      let resultState = Statuses.reducer(undefined, Statuses.actions.addStatusIdsToTimeline({ statusIds, timelineName }))

      const moreStatusIds = ['4', '2', '3']

      resultState = Statuses.reducer(resultState, Statuses.actions.addStatusIdsToTimeline({ statusIds: moreStatusIds, timelineName }))

      expect(resultState.timelines[timelineName].statusIds).toEqual(['4', '2', '3', '1'])
    })

    it('adds both Statuses and Ids to a timeline', async () => {
      const statuses = [{ id: '123', info: 'oneinfo', other: 'info' }]
      const timelineName = 'test'

      let resultState = Statuses.reducer(undefined, Statuses.actions.addStatusesToTimeline({ statuses, timelineName }))
      expect(resultState.statusesByIds).toEqual({ '123': statuses[0] })
      expect(resultState.timelines[timelineName].statusIds).toEqual(['123'])
    })
  })
})
