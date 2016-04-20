require('dotenv').load()

import schedule from 'node-schedule'
import NR from 'node-resque'
import Redis from 'ioredis'
import workers from './workers'
import { eventMarker, dispatcherTic, maxWorkerAge } from './lib'

const connectionDetails = { redis: new Redis(process.env.REDIS_URL) }

const queue = new NR.queue({ connection: connectionDetails })

const worker = new NR.multiWorker({
  connection: connectionDetails,
  queues: 'slack-integration',
  minTaskProcessors: 1,
  maxTaskProcessors: 50,
}, workers)

const scheduler = new NR.scheduler({ connection: connectionDetails })


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
    // queue.enqueue('slack-integration', 'dispatcher')

    queue.cleanOldWorkers(maxWorkerAge, (err, data) => {
      if (Object.keys(data).length > 0) console.log(eventMarker, 'cleaned old workers')
    })

    schedule.scheduleJob(dispatcherTic, () => {
      if (scheduler.master) {
        queue.enqueue('slack-integration', 'dispatcher')
        console.log(eventMarker, 'enqueued scheduled job')
      }
    })
  })
}


process.on('SIGINT', stop)
process.on('SIGTERM', stop)


export { start, queue }
