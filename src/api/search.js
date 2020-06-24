import utils from './utils'
import { emojifyAccount, emojifyStatus } from '../utils/parse_utils'

const SEARCH_URL = '/api/v2/search'

const Search = async function ({ config, queries }) {
  return utils.request({
    config,
    url: SEARCH_URL,
    queries
  })
    .then(res => {
      if (res.data.accounts) {
        res.data.accounts = res.data.accounts.map(user => emojifyAccount(user, {}))
      }
      if (res.data.statuses) {
        res.data.statuses = res.data.statuses.map(status => emojifyStatus(status, {}))
      }
      return { ...res, search: queries.q }
    })
}

export default Search
