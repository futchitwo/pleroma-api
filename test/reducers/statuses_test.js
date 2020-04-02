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

      expect(resultState.timelines[timelineName].statusIds).toEqual(['3', '2', '1'])
    })

    it('sorts by id, keeps it unique', async () => {
      const statusIds = ['1', '2', '3']
      const timelineName = 'test'

      let resultState = Statuses.reducer(undefined, Statuses.actions.addStatusIdsToTimeline({ statusIds, timelineName }))

      const moreStatusIds = ['4', '2', '3']

      resultState = Statuses.reducer(resultState, Statuses.actions.addStatusIdsToTimeline({ statusIds: moreStatusIds, timelineName }))

      expect(resultState.timelines[timelineName].statusIds).toEqual(['4', '3', '2', '1'])
    })

    it('adds both Statuses and Ids to a timeline', async () => {
      const statuses = [{ id: '123', info: 'oneinfo', other: 'info' }]
      const timelineName = 'test'

      let resultState = Statuses.reducer(undefined, Statuses.actions.addStatusesToTimeline({ statuses, timelineName }))
      expect(resultState.statusesByIds).toEqual({ '123': statuses[0] })
      expect(resultState.timelines[timelineName].statusIds).toEqual(['123'])
    })
  })
  describe('tags', () => {
    it('should add statuses to tagTimeline', () => {
      const statuses = [{ id: '123', info: 'oneinfo', other: 'info' }]

      let resultState = Statuses.reducer(undefined, Statuses.actions.addTagTimeline({ statuses }))
      expect(resultState.statusesByIds).toEqual({ '123': statuses[0] })
      expect(resultState.tag).toEqual(['123'])
    })
    it('should add statuses to existing tagTimeline', () => {
      const state = {
        statusesByIds: {
          '1': { id: '1' }
        },
        tag: ['1']
      }
      const newState ={ 
        statusesByIds: {
          '1': { id: '1' },
          '2': { id: '2', content: '2', spoiler_text: '2' }
        },
        tag: [ '2', '1']
      }
      const statuses = [{ id: '2', content: '2', spoiler_text: '2' }]
      let resultState = Statuses.reducer(state, Statuses.actions.addTagTimeline({ statuses }))
      expect(resultState.statusesByIds).toEqual(newState.statusesByIds)
      expect(resultState.tag).toEqual(newState.tag)
    })
    it('should clear tagTimeline', () => {
      const state = {
        statusesByIds: {
          '1': { id: '1' }
        },
        tag: ['1']
      }
      const statuses = [{ id: '2', content: '2', spoiler_text: '2' }]
      let resultState = Statuses.reducer(state, Statuses.actions.clearTagTimeline())
      expect(resultState.statusesByIds).toEqual(state.statusesByIds)
      expect(resultState.tag).toEqual([])
    })
  })
})
