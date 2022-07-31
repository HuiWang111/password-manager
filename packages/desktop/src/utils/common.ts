export function wait(time: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, time)
  })
}

export function noop() {}
