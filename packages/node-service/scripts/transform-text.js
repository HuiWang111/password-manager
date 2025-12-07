const { readFile } = require('node:fs/promises');
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
    const json = await readFile(path)
    const list = JSON.parse(json)
    list.forEach((item) => {
      if (!isLikelyEncoded(item.remark)) {
        item.remark = decodeURIComponent(item.remark || '')
      }
    })
  } catch(e) {
    console.error(e)
  }
}