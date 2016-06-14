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

export const surveyActions = {
}

import fetchMessages from './admin/fetchMessages'
import postMessage from './admin/postMessage'

import createSurvey from './admin/createSurvey'
import updateSurvey from './admin/updateSurvey'
import destroySurvey from './admin/destroySurvey'

import createQuestion from './admin/createQuestion'
import updateQuestion from './admin/updateQuestion'
import destroyQuestion from './admin/destroyQuestion'

import createAnswer from './admin/createAnswer'
import updateAnswer from './admin/updateAnswer'
import destroyAnswer from './admin/destroyAnswer'

import createResult from './admin/createResult'
import updateResult from './admin/updateResult'
import destroyResult from './admin/destroyResult'

export const teamsActions = {}
export const usersActions = { fetchMessages, fetchThemes, postMessage }
export const surveysActions = {
  createSurvey,
  updateSurvey,
  destroySurvey,
  createQuestion,
  updateQuestion,
  destroyQuestion,
  createAnswer,
  updateAnswer,
  destroyAnswer,
  createResult,
  updateResult,
  destroyResult,
}
