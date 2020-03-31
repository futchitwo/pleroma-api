import Api from '../../src/reducers/api.js'
describe('Api reducer', () => {
  describe('timelines', () => {
    it('sets a fetcher for a timeline', () => {
      const fetcher = 'fetcher'
      const timelineName = 'timelineName'

      const resultState = Api.reducer(
        undefined,
        Api.actions.setFetcher({ timelineName, fetcher })
      )

      expect(resultState.timelines[timelineName].fetcher).toEqual(fetcher)
    })

    it('sets a fetcher for a notifications', () => {
      const fetcher = 'fetcher'
      const entity = 'notifications'

      const resultState = Api.reducer(
        undefined,
        Api.actions.setFetcher({ entity, fetcher })
      )

      expect(resultState.notifications.fetcher).toEqual(fetcher)
    })

    it('sets a poll fetcher', () => {
      const fetcher = 'fetcher'
      const statusId = '193'

      const resultState = Api.reducer(
        undefined,
        Api.actions.setPollFetcher({ params: { statusId }, fetcher })
      )

      expect(resultState.polls[statusId].fetcher).toEqual(fetcher)
    })

    it('sets prev and next for a  timeline', () => {
      const prev = 'prev'
      const next = 'next'
      const timelineName = 'timelineName'

      let resultState

      resultState = Api.reducer(
        undefined,
        Api.actions.setPrev({ timelineName, prev })
      )

      expect(resultState.timelines[timelineName].prev).toEqual(prev)

      resultState = Api.reducer(
        resultState,
        Api.actions.setNext({ timelineName, next })
      )

      expect(resultState.timelines[timelineName].prev).toEqual(prev)
      expect(resultState.timelines[timelineName].next).toEqual(next)
    })

    it('sets prev and next for notifications', () => {
      const prev = 'prev'
      const next = 'next'
      const entity = 'notifications'

      let resultState

      resultState = Api.reducer(
        undefined,
        Api.actions.setPrev({ entity, prev })
      )

      expect(resultState.notifications.prev).toEqual(prev)

      resultState = Api.reducer(
        resultState,
        Api.actions.setNext({ entity, next })
      )

      expect(resultState.notifications.prev).toEqual(prev)
      expect(resultState.notifications.next).toEqual(next)
    })
  })

  describe('config', () => {
    it('sets a config, merging new info in', () => {
      const config = { instance: 'https://pleroma.soykaf.com' }
      const resultState = Api.reducer(
        undefined,
        Api.actions.addConfig({ config })
      )

      expect(resultState.config).toEqual(config)

      const additionalConfig = { accessToken: 'token' }
      const updatedState = Api.reducer(
        resultState,
        Api.actions.addConfig({ config: additionalConfig })
      )

      expect(updatedState.config).toEqual({
        instance: 'https://pleroma.soykaf.com',
        accessToken: 'token'
      })
    })
  })
})
