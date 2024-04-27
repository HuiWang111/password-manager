export function toBoolean(str?: string, defaultValue = false) {
  if (typeof str === 'undefined') {
    return defaultValue
  } else if (str === 'true') {
    return true
  } else if (str === 'false') {
    return false
  }
  return false
}
