function padTime (s) {
  s = s.toString()
  if (s.length < 2) return '0' + s
  return s
}

export function dateToLocalStr (date, showSeconds = false) {
  const dateObj = new Date(date)
  let str = [dateObj.getFullYear(), padTime(dateObj.getMonth() + 1), padTime(dateObj.getDate())].join('/') + ' ' + [padTime(dateObj.getHours()), padTime(dateObj.getMinutes())].join(':')
  if (showSeconds) {
    str += ':' + padTime(dateObj.getSeconds())
  }
  return str
}
