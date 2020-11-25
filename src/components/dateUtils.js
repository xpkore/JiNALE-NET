function padTime (s) {
  s = s.toString()
  if (s.length < 2) return '0' + s
  return s
}

/**
 * 
 * @param {string} date
 * @return {Date} date object
 */
export function standardizeDate (date) {
  return new Date(date.replace(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, '$1/$2/$3 $4:$5:$6 +0900'))
}

/**
 * 
 * @param {string} date 
 * @param {boolean} showSeconds display seconds in result
 * @return string formatted date
 */
export function dateToLocalStr (date, showSeconds = false) {
  const dateObj = standardizeDate(date)
  let str = [dateObj.getFullYear(), padTime(dateObj.getMonth() + 1), padTime(dateObj.getDate())].join('/') + ' ' + [padTime(dateObj.getHours()), padTime(dateObj.getMinutes())].join(':')
  if (showSeconds) {
    str += ':' + padTime(dateObj.getSeconds())
  }
  return str
}

const timeagoInstance = {
  format: function (date) {
    date = new Date(date)
    const ts = date.getTime(), now = new Date
    if (date.getFullYear() == now.getFullYear()) {
      if (date.getMonth() == now.getMonth()) {
        if (date.getDate() == now.getDate()) {
          return padTime(date.getHours()) + ':' + padTime(date.getMinutes())
        }
        var day = now.getDate() - date.getDate();
        if (day == 1) return '昨天 ' + padTime(date.getHours()) + ':' + padTime(date.getMinutes())
      }
      return padTime(date.getMonth() + 1) + '/' + padTime(date.getDate()) + ' ' + padTime(date.getHours()) + ':' + padTime(date.getMinutes())
    }
    return date.getFullYear() + '/' + padTime(date.getMonth() + 1) + '/' + padTime(date.getDate()) + ' ' + padTime(date.getHours()) + ':' + padTime(date.getMinutes())
  }
}
function timeagoRun () {
  const needs = [].slice.call(document.getElementsByClassName('timeago'));
  needs.forEach(i => {
    if (i.hasAttribute('datetime')) i.textContent = timeagoInstance.format(i.getAttribute('datetime'));
  });
}
setInterval(timeagoRun, 6e4);
window.addEventListener('trigger-timeago', timeagoRun)
