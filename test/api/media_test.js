import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Media api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/media', () => {
    it('returns attachment', async () => {
      const attachment = {
        description: '1.png',
        id: '1',
        pleroma: {
          mime_type: 'image/png'
        },
        preview_url: 'https://pleroma.soykaf.com/media/1.png?name=1.png',
        type: 'image'
      }
      fetch.mockImplementationOnce(fetchMocker(attachment, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/media'
      }))
      const file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAwUlEQVRIie2TOwrCQBBAX2EnnkCD+DmDFpaeMmdQ7IKViHeJlShJBAURtHACyzpJdgMWwj6YYmdm57sLgcBfEgExkAJ34OUoJ2ADTOuCL4HMI6gmFynyixFQiNMWWABdj87HQCL3V5pDLMbE0E2AA3BrqLpkKOdMS5CKcWbo9g2B7QSRnHMtwUOMPUN3FZ06U4s+DSPSOtg5dmDKuaogbQcDPjt4OgTOgXVdt/YrmgOdKue2tP0HXpQ/+firBIGAH2+FZYAFWD53+gAAAABJRU5ErkJggg=='
      const res = await api.media.upload({ config, body: { file } })

      expect(res.data).toEqual({
        description: '1.png',
        id: '1',
        pleroma: {
          mime_type: 'image/png'
        },
        preview_url: 'https://pleroma.soykaf.com/media/1.png?name=1.png',
        type: 'image'
      })
    })
  })
})
