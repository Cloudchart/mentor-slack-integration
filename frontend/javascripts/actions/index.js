import fetchThemes from './fetchThemes'
import updateThemeStatus from './updateThemeStatus'
import createChannel from './createChannel'
import destroyChannel from './destroyChannel'
import updateTimeSetting from './updateTimeSetting'
import fetchChannels from './fetchChannels'

export const configActions = {
  fetchThemes,
  updateThemeStatus,
  createChannel,
  destroyChannel,
  updateTimeSetting,
  fetchChannels,
}

import fetchTeamUsers from './admin/fetchTeamUsers'

export const teamsActions = {
  fetchTeamUsers,
}
