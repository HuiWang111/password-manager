import { createPM } from '@kennys_wang/pm-node-service'

main()

async function main() {
  const passwordManager = createPM({
    default: {
      pmDirectory: '~'
    }
  })
  
  setTimeout(async () => {
    await passwordManager.clearMainPassword()
  }, 1000)
}
