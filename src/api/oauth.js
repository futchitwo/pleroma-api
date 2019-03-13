import utils from './utils.js'

const createApp = async ({ config, params = {} }) => {
  const defaults = {
    client_name: 'Pleroma API Library',
    redirect_uris: `${window.location.origin}/oauth-callback`,
    scopes: 'read write follow push'
  }

  params = {
    ...defaults,
    ...params
  }

  return utils.request({
    method: 'POST',
    config,
    url: '/api/v1/apps',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const getTokenWithPassword = async ({ config, params }) => {
  params = {
    client_id: params.client_id,
    client_secret: params.client_secret,
    grant_type: 'password',
    username: params.username,
    password: params.password
  }

  return utils.request({
    method: 'POST',
    config,
    url: '/oauth/token',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const oauth = {
  createApp,
  getTokenWithPassword
}

export default oauth
