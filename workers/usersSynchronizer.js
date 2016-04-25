import { getAndSyncUsers } from './helpers'
import { Team } from '../models'

const workerName = 'usersSynchronizer'


// sync users for all teams
async function perform(done) {
  const teams = await Team.findAll({ where: { isActive: true } })

  const jobs = teams.reduce(async (promiseChain, team) => {
    return promiseChain.then(async () => {
      await getAndSyncUsers(team)
    })
  }, Promise.resolve())

  jobs.then(() => done(null, true))
}


export { perform }
