export default function userAnswers(state = [], action) {
  switch (action.type) {
    case 'ANSWER_QUESTION_RECEIVE':
      return state.concat(action.userAnswer)
    default:
      return state
  }
}
