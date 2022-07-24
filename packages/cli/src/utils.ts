export function groupBy(list?: Record<string, any>[], key?: string): Record<string, Record<string, any>[]> {
  if (!list || !list.length || !key) {
    return {}
  }

  const result: Record<string, Record<string, string>[]> = {}
  list.forEach(item => {
    if (key in item) {
      const field = item[key]
      if (!(field in result)) {
        result[field] = []
      }
      result[field].push(item)
    }
  })

  return result
}