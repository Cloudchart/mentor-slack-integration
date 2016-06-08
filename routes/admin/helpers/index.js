import { botTeamId } from '../../../lib'
import { Team } from '../../../models'


export function checkAuth(req, res, next) {
  req.session.teamId === botTeamId ? next() : res.redirect('/')
}

export function getTeam(id) {
  return new Promise(async (resolve, reject) => {
    const team = await Team.findById(id)
    resolve({ id: team.id, name: team.name, isAdmin: team.id === botTeamId })
  })
}

export function getFilteredAttrs(attrs, permittedAttrs) {
  let filteredAttrs = {}
  Object.keys(attrs).forEach(key => {
    if (permittedAttrs.includes(key)) filteredAttrs[key] = attrs[key]
  })
  return filteredAttrs
}
