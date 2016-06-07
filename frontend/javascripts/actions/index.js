import fetchThemes from './fetchThemes'
import updateThemeStatus from './updateThemeStatus'
import createChannel from './createChannel'
import destroyChannel from './destroyChannel'
import updateTimeSetting from './updateTimeSetting'
import fetchChannels from './fetchChannels'
import updateChannel from './updateChannel'
import sendChannelInviteNotification from './sendChannelInviteNotification'

export const configActions = {
  fetchThemes,
  updateThemeStatus,
  createChannel,
  destroyChannel,
  updateTimeSetting,
  fetchChannels,
  updateChannel,
  sendChannelInviteNotification,
}

import fetchMessages from './admin/fetchMessages'
import postMessage from './admin/postMessage'
import createSurvey from './admin/createSurvey'
import destroySurvey from './admin/destroySurvey'

export const teamsActions = {}
export const surveysActions = { createSurvey, destroySurvey }
export const usersActions = { fetchMessages, fetchThemes, postMessage }
