export default function surveys(state = [], action) {
  switch (action.type) {
    case 'CREATE_SURVEY_RECEIVE':
      return state.concat(action.survey)
    case 'DESTROY_SURVEY_RECEIVE':
      return state.filter(survey => survey.id !== action.id)
    default:
      return state
  }
}
