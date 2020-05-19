import Config from '../../src/reducers/config'

describe('Config reducers', () => {
  it('set a instance config', () => {
    const settings = { theme: 'pleroma-dark' }
    const resultState = Config.reducer(undefined, Config.actions.addConfig({ config: { settings } }))

    expect(resultState.settings).toEqual(settings)
  })

  it('clear config', () => {
    const config = { theme: 'pleroma-dark' }
    const resultState = Config.reducer(config, Config.actions.clear())

    expect(resultState).toEqual({})
  })
})
