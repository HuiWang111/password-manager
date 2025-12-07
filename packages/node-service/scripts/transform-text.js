const { readFile, writeFile } = require('node:fs/promises');
const os = require('node:os')
const { join } = require('node:path')

transformText()

function isLikelyEncoded(str) {
  try {
    return str === encodeURIComponent(decodeURIComponent(str));
  } catch (e) {
    return false;
  }
}

async function transformText () {
  try {
    const path = join(os.homedir(), '.password-manager/storage/storage.json')
    const json = await readFile(path, 'utf-8')
    const list = JSON.parse(json)
    list.forEach((item) => {
      if (!isLikelyEncoded(item.remark)) {
        item.remark = encodeURIComponent(item.remark || '')
      }
    })
    await writeFile(path, JSON.stringify(list, null, 2), 'utf-8')
  } catch(e) {
    console.error(e)
  }
}