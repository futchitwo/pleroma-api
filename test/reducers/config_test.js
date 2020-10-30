import Config from '../../src/reducers/config'

describe('Config reducers', () => {
  it('set a instance config', () => {
    const settings = { theme: 'pleroma-dark' }
    const resultState = Config.reducer(undefined, Config.actions.addConfig({ config: { settings } }))

    expect(resultState.settings).toEqual(settings)
  })

  it('add emojis', () => {
    const config = {
      theme: 'pleroma-dark'
    }
    const emojis = [
      {
        shortcode: 'blobaww',
        url: 'https://files.mastodon.social/custom_emojis/images/000/011/739/original/blobaww.png',
        static_url: 'https://files.mastodon.social/custom_emojis/images/000/011/739/static/blobaww.png',
        visible_in_picker: true,
        category: 'Blobs'
      }
    ]
    const resultState = Config.reducer(config, Config.actions.addEmojis({ emojis }))

    expect(resultState).toEqual({ theme: 'pleroma-dark', emojis })
  })

  it('clear config', () => {
    const config = { theme: 'pleroma-dark' }
    const resultState = Config.reducer(config, Config.actions.clear())

    expect(resultState).toEqual({})
  })
})
