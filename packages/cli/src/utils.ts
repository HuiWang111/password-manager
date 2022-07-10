import type { PathLike } from 'fs';
import { access } from 'fs/promises'

export async function isExists(path: PathLike, mode?: number): Promise<boolean> {
  try {
    await access(path, mode)
    return Promise.resolve(true)
  } catch (e) {
    return Promise.resolve(false)
  }
}