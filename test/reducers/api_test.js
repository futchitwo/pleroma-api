import Api from '../../src/reducers/api.js'
describe('Api reducer', () => {
  describe('config', () => {
    it('sets a config, merging new info in', () => {
      const config = { instance: 'https://pleroma.soykaf.com' }
      const resultState = Api.reducer(
        undefined,
        Api.actions.addConfig({ config })
      )

      expect(resultState.config).toEqual(config)

      const additionalConfig = { accessToken: "token" }
      const updatedState = Api.reducer(
        resultState,
        Api.actions.addConfig({ config: additionalConfig })
      )

      expect(updatedState.config).toEqual({
        instance: "https://pleroma.soykaf.com",
        accessToken: "token"
      })
    })
  })
})
