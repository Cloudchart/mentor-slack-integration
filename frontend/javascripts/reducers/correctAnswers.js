export default function correctAnswers(state = [], action) {
  switch (action.type) {
    case 'ANSWER_QUESTION_RECEIVE':
      return state.concat(action.correctAnswerIds)
    default:
      return state
  }
}
