export const emojify = (html, emojis) => {
  let replaced = html
  if (!emojis) return html
  for (let i = 0; i < emojis.length; i++) {
    let emoji = emojis[i]
    replaced = replaced.replace(
      new RegExp(`:${emoji.shortcode}:`, 'g'),
      `<img draggable='false' class='custom-emoji' src='${emoji.url}' alt='${emoji.shortcode}' title='${emoji.shortcode}' />`
    )
  }
  return replaced
}
