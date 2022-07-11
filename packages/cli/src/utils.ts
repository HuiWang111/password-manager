import type { PathLike } from 'fs'
import { writeFileSync, readFileSync, accessSync, mkdirSync } from 'fs'

export async function isExists(path: PathLike, mode?: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      accessSync(path, mode)
      resolve(true)
    } catch (e) {
      resolve(false)
    }
  })
}

type unPromiseFn = (...args: any[]) => any
type PrimisedFn = (...args: any[]) => Promise<any>

export function promisifyForSync(fn: unPromiseFn): PrimisedFn {
  return function promised(...args: any[]) {
    return new Promise((resolve, reject) => {
      try {
        const data = fn(...args)
        resolve(data)
      } catch(e) {
        reject(e)
      }
    })
  }
}

/**
 * fsPromises.writeFile / fs.writeFile都无法成功写入文件，调用之后try 和 catch都打印不出log
 */
export const writeFile = promisifyForSync(writeFileSync)
export const readFile = promisifyForSync(readFileSync)
export const mkdir = promisifyForSync(mkdirSync)