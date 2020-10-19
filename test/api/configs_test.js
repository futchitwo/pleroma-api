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
  describe('/.well-known/nodeinfo', () => {
    it('returns list of supported nodeinfo schemes', async () => {
      fetch.mockImplementationOnce(fetchMocker({ invitesEnabled: true, nodeName: 'pleroma.site' }, {
        expectedUrl: 'https://pleroma.soykaf.com/.well-known/nodeinfo'
      }))
      const res = await api.configs.getNodeinfoSchemes({ config })

      expect(res.data).toEqual({ invitesEnabled: true, nodeName: 'pleroma.site' })
    })
  })
  describe('/nodeinfo/2.1.json', () => {
    it('returns instance configurations by full url', async () => {
      fetch.mockImplementationOnce(fetchMocker({ invitesEnabled: true, nodeName: 'pleroma.site' }, {
        expectedUrl: 'https://pleroma.soykaf.com/nodeinfo/2.1.json'
      }))
      const res = await api.configs.getInstanceNodeinfo({ config, fullUrl: `https://pleroma.soykaf.com/nodeinfo/2.1.json` })

      expect(res.data).toEqual({ invitesEnabled: true, nodeName: 'pleroma.site' })
    })
    it('returns instance configurations by nodeinfo version', async () => {
      fetch.mockImplementationOnce(fetchMocker({ invitesEnabled: true, nodeName: 'pleroma.site' }, {
        expectedUrl: 'https://pleroma.soykaf.com/nodeinfo/2.1.json'
      }))
      const res = await api.configs.getInstanceNodeinfo({ config, params: { version: '2.1' } })

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
  describe('/api/v1/custom_emojis', () => {
    it('returns list of custom emoji', async () => {
      const emojis = [
        { "girlpower": {
          "tags": [
            "Finmoji"
          ],
          "image_url": "/finmoji/128px/girlpower-128.png"
        } }
      ]
      fetch.mockImplementationOnce(fetchMocker(emojis, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/custom_emojis'
      }))
      const res = await api.configs.getCustomEmojis({ config })

      expect(res.data).toEqual(emojis)
    })
  })
  describe('/api/v1/instance/peers', () => {
    it('returns list of known remote instances', async () => {
      const instances = [
        'nsfw.social',
        'friendica.a-zwenkau.de'
      ]
      fetch.mockImplementationOnce(fetchMocker(instances, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/instance/peers'
      }))
      const res = await api.configs.getRemoteInstances({ config })

      expect(res.data).toEqual(instances)
    })
  })
})
