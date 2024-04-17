export function toBoolean(str: string) {
  if (str === 'true') {
    return true
  } else if (str === 'false') {
    return false
  }
  return false
}
