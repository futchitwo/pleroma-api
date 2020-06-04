import * as ParseUtils from '../../src/utils/parse_utils'
const emojis = [
  {
    shortcode: 'marko',
    url: 'http://thesourceurl'
  },
  {
    shortcode: 'tim',
    url: 'http://thesourceurl'
  }
]

describe('ParseUtils', () => {
  describe('emojify', () => {

    it('should convert :short_code: to img tag', () => {
      const content = '<p>This is a test :marko:</p>'
      const expected = "<p>This is a test <img draggable='false' class='custom-emoji' src='http://thesourceurl' alt='marko' title='marko' /></p>"
      expect(ParseUtils.emojify(content, emojis)).toBe(expected)
    })

    it('should handle multiple :short_codes:', () => {
      const content = '<p>This is a test :marko::tim::marko:</p>'
      const expected = "<p>This is a test <img draggable='false' class='custom-emoji' src='http://thesourceurl' alt='marko' title='marko' />" +
        "<img draggable='false' class='custom-emoji' src='http://thesourceurl' alt='tim' title='tim' />" +
        "<img draggable='false' class='custom-emoji' src='http://thesourceurl' alt='marko' title='marko' /></p>"
      expect(ParseUtils.emojify(content, emojis)).toBe(expected)
    })
  })

  describe('Emojify account', () => {
    it('should return account with emojified display_name', () => {
      const account = {
        display_name: 'This is a test :marko:',
        emojis
      }
      const expected = {
        display_name: "This is a test <img draggable='false' class='custom-emoji' src='http://thesourceurl' alt='marko' title='marko' />",
        emojis
      }
      expect(ParseUtils.emojifyAccount(account)).toEqual(expected)
    })
    it("should use an old account if new wasn't sent", () => {
      const account = {
        emojis
      }
      const old_account = {
        display_name: '<p>This is a test :marko::tim::marko:</p>',
        emojis
      }
      const expected = {
        display_name: "<p>This is a test <img draggable='false' class='custom-emoji' src='http://thesourceurl' alt='marko' title='marko' />" +
        "<img draggable='false' class='custom-emoji' src='http://thesourceurl' alt='tim' title='tim' />" +
        "<img draggable='false' class='custom-emoji' src='http://thesourceurl' alt='marko' title='marko' /></p>",
        emojis
      }
      expect(ParseUtils.emojifyAccount(account, old_account)).toEqual(expected)
    })
  })
  
})
