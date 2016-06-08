export default function surveys(state = [], action) {
  switch (action.type) {
    case 'CREATE_SURVEY_RECEIVE':
      return state.concat(action.survey)
    case 'UPDATE_SURVEY_RECEIVE':
      return state.map(survey => survey.id === action.id ? action.survey : survey)
    case 'DESTROY_SURVEY_RECEIVE':
      return state.filter(survey => survey.id !== action.id)
    default:
      return state
  }
}
