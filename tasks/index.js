import { Team } from '../models'


const tasks = {
  updateTeamOwnerIds: () => {
    Team.findAll().then(teams => {
      teams.forEach(team => {
        const data = JSON.parse(team.responseBody)
        if (data.user_id) team.update({ ownerId: data.user_id })
      })
    }).catch(err => {
      console.log(err)
    })
  },
}

function run(name) {
  if (tasks[name]) {
    tasks[name]()
  } else {
    console.log('did not find task:', name)
  }
}


export { run }
