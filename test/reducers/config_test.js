import Config from '../../src/reducers/config'

describe('Config reducers', () => {
  it('set a instance config', () => {
    const config = { theme: 'pleroma-dark' }
    const resultState = Config.reducer(undefined, Config.actions.addConfig({ config }))

    expect(resultState.settings).toEqual(config)
  })

  it('clear config', () => {
    const config = { theme: 'pleroma-dark' }
    const resultState = Config.reducer(config, Config.actions.clear())

    expect(resultState.settings).toEqual({})
  })
})
