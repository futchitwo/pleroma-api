export const emojify = (html, emojis) => {
  let replaced = html
  if (!emojis || !html) return html
  for (let i = 0; i < emojis.length; i++) {
    let emoji = emojis[i]
    replaced = replaced.replace(
      new RegExp(`:${emoji.shortcode}:`, 'g'),
      `<img draggable='false' class='custom-emoji' src='${emoji.url}' alt='${emoji.shortcode}' title='${emoji.shortcode}' />`
    )
  }
  return replaced
}

export const emojifyAccount = (account, oldAccount) => {
  if (!account) return null

  account.display_name = emojify(
    account.display_name || (oldAccount ? oldAccount.display_name : ''),
    account.emojis || (oldAccount ? oldAccount.emojis : []))
  return account
}

export const emojifyStatus = (status, oldStatus) => {
  if (!status) return null
  if (status.account) {
    status.account = emojifyAccount(status.account, oldStatus.account)
  }
  if (status.reblog) {
    const { reblog } = status
    const oldReblog = oldStatus.reblog
    status.reblog.account = emojifyAccount(reblog.account, oldReblog ? oldReblog.account : null)
  }
  if (status.favourited_by) {
    status.favourited_by = status.favourited_by.map(account => emojifyAccount(account))
  }
  if (status.reblogged_by) {
    status.reblogged_by = status.reblogged_by.map(account => emojifyAccount(account))
  }
  const emojis = status.reblog ? status.reblog.emojis : status.emojis
  const oldEmojis = oldStatus.reblog ? oldStatus.reblog.emojis : oldStatus.emojis

  if (emojis || oldEmojis) {
    status.content = emojify(status.content || oldStatus.content, emojis || oldEmojis)
    status.spoiler_text = emojify(status.spoiler_text || oldStatus.spoiler_text, emojis || oldEmojis)
  }
  return status
}
