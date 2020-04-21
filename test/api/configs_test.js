import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Configs api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/pleroma/captcha', () => {
    it('returns attachment', async () => {
      const file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAwUlEQVRIie2TOwrCQBBAX2EnnkCD+DmDFpaeMmdQ7IKViHeJlShJBAURtHACyzpJdgMWwj6YYmdm57sLgcBfEgExkAJ34OUoJ2ADTOuCL4HMI6gmFynyixFQiNMWWABdj87HQCL3V5pDLMbE0E2AA3BrqLpkKOdMS5CKcWbo9g2B7QSRnHMtwUOMPUN3FZ06U4s+DSPSOtg5dmDKuaogbQcDPjt4OgTOgXVdt/YrmgOdKue2tP0HXpQ/+firBIGAH2+FZYAFWD53+gAAAABJRU5ErkJggg=='
      const captcha = {
        answer_data: 'asdfghjkl',
        token: 'qwerty123',
        type: 'native',
        url: file
      }
      fetch.mockImplementationOnce(fetchMocker(captcha, {
        expectedUrl: 'https://pleroma.soykaf.com/api/pleroma/captcha'
      }))
      const res = await api.configs.getCaptcha({ config })

      expect(res.data).toEqual(captcha)
    })
  })
  describe('/api/pleroma/frontend_configurations', () => {
    it('returns instance configurations', async () => {
      fetch.mockImplementationOnce(fetchMocker({ theme: 'dark' }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/pleroma/frontend_configurations'
      }))
      const res = await api.configs.getFrontendConfigurations({ config })

      expect(res.data).toEqual({ theme: 'dark' })
    })
  })
  describe('/nodeinfo/2.1.json', () => {
    it('returns instance configurations', async () => {
      fetch.mockImplementationOnce(fetchMocker({ invitesEnabled: true, nodeName: 'pleroma.site' }, {
        expectedUrl: 'https://pleroma.soykaf.com/nodeinfo/2.1.json'
      }))
      const res = await api.configs.getInstanceConfigurations({ config })

      expect(res.data).toEqual({ invitesEnabled: true, nodeName: 'pleroma.site' })
    })
  })
  describe('/static/config', () => {
    it('returns instance configurations', async () => {
      fetch.mockImplementationOnce(fetchMocker({ hideUserStats: true, hidePostStats: false }, {
        expectedUrl: 'https://pleroma.soykaf.com/static/config.json'
      }))
      const res = await api.configs.getConfig({ config })

      expect(res.data).toEqual({ hideUserStats: true, hidePostStats: false })
    })
  })
})
