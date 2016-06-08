export default function questions(state = [], action) {
  switch (action.type) {
    case 'CREATE_QUESTION_RECEIVE':
      return state.concat(action.question)
    default:
      return state
  }
}
