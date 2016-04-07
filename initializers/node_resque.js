require('dotenv').load()

import schedule from 'node-schedule'
import NR from 'node-resque'
import Redis from 'ioredis'
import workers from '../workers'
import { eventMarker, dispatcherTic, maxWorkerAge } from '../lib'

const redisClient = new Redis(process.env.REDIS_URL)
const queue = new NR.queue({ connection: { redis: redisClient } }, workers)

const worker = new NR.multiWorker({
  connection: { redis: redisClient.duplicate() },
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
    // TODO: move this to the test suite
    // queue.enqueue('slack-integration', 'insightsDispatcher')
    // queue.enqueue('slack-integration', 'linksDispatcher')

    queue.cleanOldWorkers(maxWorkerAge, (err, data) => {
      if (Object.keys(data).length > 0) console.log(eventMarker, 'cleaned old workers')
    })

    schedule.scheduleJob(dispatcherTic, () => {
      if (scheduler.master) {
        queue.enqueue('slack-integration', 'insightsDispatcher')
        console.log(eventMarker, 'enqueued scheduled job')
      }
    })
  })
}


process.on('SIGINT', stop)
process.on('SIGTERM', stop)


export { start, queue }
