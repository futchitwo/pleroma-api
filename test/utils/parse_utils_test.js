import * as ParseUtils from '../../src/utils/parse_utils'

describe('ParseUtils', () => {
  describe('emojify', () => {
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
})
