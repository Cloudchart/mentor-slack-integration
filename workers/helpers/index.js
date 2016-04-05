import { errorMarker } from '../../lib'
import { callWebAppGraphQL } from '../../routes/helpers'
import { TeamOwner } from '../../models'


export async function getTeamOwner(teamId, SlackWeb) {
  return new Promise(async (resolve, reject) => {
    let teamOwner = await TeamOwner.findOne({ where: { teamId: teamId } })

    if (teamOwner) {
      resolve(teamOwner)
    } else {
      SlackWeb.users.list((err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, 'getTeamOwner', 'users.list')
          reject()
        } else {
          let primaryOwner = res.members.find(member => member.is_primary_owner)
          // let primaryOwner = res.members.find(member => member.name === 'peresleguine')

          SlackWeb.dm.list((err, res) => {
            if (err = err || res.error) {
              console.log(errorMarker, err, 'getTeamOwner', 'im.list')
              reject()
            } else {
              let im = res.ims.find(im => im.user === primaryOwner.id)
              if (!im) return resolve(null)

              TeamOwner.findOrCreate({
                where: { id: im.user },
                defaults: { teamId: teamId, imId: im.id, responseBody: JSON.stringify(im) }
              }).spread((teamOwner, created) => {
                resolve(teamOwner)
              })
            }

          })
        }
      })
    }

  })
}

export function getSubscribedThemes(channelId) {
  return new Promise(async (resolve, reject) => {
    const themesRes = await callWebAppGraphQL(channelId, 'GET', `
      {
        viewer {
          themes {
            edges {
              node {
                name
                isSubscribed
              }
            }
          }
        }
      }
    `)

    const viewer = JSON.parse(themesRes).data.viewer
    let themes = []

    if (viewer && viewer.themes) {
      themes = viewer.themes.edges.map(edge => edge.node)
      themes = themes.filter(theme => theme.isSubscribed)
      themes = themes.map(theme => theme.name)
    }

    resolve(themes)
  })
}
