require('dotenv').load()

import schedule from 'node-schedule'
import NR from 'node-resque'
import Redis from 'ioredis'
import workers from '../workers'

const redisClient = new Redis(process.env.REDIS_URL)
const queue = new NR.queue({ connection: { redis: redisClient } }, workers)

const worker = new NR.multiWorker({
  connection: { redis: redisClient },
  queues: 'slack-integration',
  minTaskProcessors: 1,
  maxTaskProcessors: 20,
}, workers)

const scheduler = new NR.scheduler({ connection: { redis: redisClient } })


function stop() {
  scheduler.end(() => {
    worker.end(() => {
      console.log('>>> stopped all workers')
      return process.exit(0)
    })
  })
}

function start() {
  scheduler.connect(() => {
    scheduler.start()
    console.log('>>> started scheduler')

    worker.start()
    console.log('>>> started worker')
  })

  queue.connect(() => {
    schedule.scheduleJob('*/15 * * * *', () => {
      if (scheduler.master) {
        queue.enqueue('slack-integration', 'spreader')
        console.log('>>> enqueued scheduled job')
      }
    })
  })
}


process.on('SIGINT', stop)
process.on('SIGTERM', stop)


export { start }
