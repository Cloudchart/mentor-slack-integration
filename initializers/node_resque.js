require('dotenv').load()

import schedule from 'node-schedule'
import NR from 'node-resque'
import Redis from 'ioredis'
import workers from '../workers'
import { eventMarker, senderTicInMin, maxWorkerAge } from '../lib'

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
      process.exit(0)
    })
  })
}

function start() {
  scheduler.connect(() => {
    scheduler.start()
    console.log(eventMarker, 'started scheduler')

    worker.start()
    console.log(eventMarker, 'started worker')
  })

  queue.connect(() => {
    // TODO: move next line to the test suite
    // queue.enqueue('slack-integration', 'sender')

    queue.cleanOldWorkers(maxWorkerAge, (err, data) => {
      if (Object.keys(data).length > 0) console.log(eventMarker, 'cleaned old workers')
    })

    schedule.scheduleJob(`*/${senderTicInMin} * * * *`, () => {
      if (scheduler.master) {
        queue.enqueue('slack-integration', 'sender')
        console.log(eventMarker, 'enqueued scheduled job')
      }
    })
  })
}


process.on('SIGINT', stop)
process.on('SIGTERM', stop)


export { start, queue }
