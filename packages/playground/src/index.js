import { createPM } from '@kennys_wang/pm-node-service'

main()

async function main() {
  const passwordManager = createPM({
    default: {
      pmDirectory: '~'
    }
  })
  
  setTimeout(async () => {
    await passwordManager.export('D:\\Desktop\\pm.json')
  }, 1000)
}
