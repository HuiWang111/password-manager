export function containsIgnoreCase (
  source: string | string[],
  search: string,
  position?: number | undefined,
) {
  if (typeof source === 'string') {
    return source.toLocaleLowerCase().includes(search, position)
  }
  return source.some(s => {
    return s.toLocaleLowerCase().includes(search, position)
  })
}