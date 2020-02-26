import utils from './utils'

const SEARCH_URL = '/api/v2/search'

const Search = async function({ config, queries }) {
  return utils.request({
    config,
    url: SEARCH_URL,
    queries
  })
}

export default Search
