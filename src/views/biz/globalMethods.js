// src/globalMethods.js
export function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString(undefined, options)
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// 其他全局方法...
/** 日期转字符串 */
export function dateToStr(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const hours = date.getHours()
  const min = date.getMinutes()
  const second = date.getSeconds()
  return year + '-' +
    ((month + 1) > 9 ? (month + 1) : '0' + (month + 1)) + '-' +
    (day > 9 ? day : ('0' + day)) + ' ' +
    (hours > 9 ? hours : ('0' + hours)) + ':' +
    (min > 9 ? min : ('0' + min)) + ':' +
    (second > 9 ? second : ('0' + second))
}

/** 四舍五入 保留N位小数 */
export function getBit(value, bit = 2) {
  if (value !== null && value !== '') {
    let str = Number(value)
    str = str.toFixed(bit)
    return str
  } else {
    return null
  }
}

export function convertNull(value) {
  return value === null || value === undefined ? '--' : value
}

export function formatDt(date) {
  if (date) {
    const formattedDate = new Date(date)
    const year = formattedDate.getFullYear()
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0')
    const day = String(formattedDate.getDate()).padStart(2, '0')
    const hours = String(formattedDate.getHours()).padStart(2, '0')
    const minutes = String(formattedDate.getMinutes()).padStart(2, '0')
    const seconds = String(formattedDate.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  return null
}

