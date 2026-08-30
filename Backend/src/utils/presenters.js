export function presentReview(review, { includeAuthor = false } = {}) {
  const value = review.toObject ? review.toObject() : review
  if (value.anonymous || !includeAuthor) delete value.author
  return value
}

export function presentQuestion(question, { includeAuthor = false } = {}) {
  const value = question.toObject ? question.toObject() : question
  if (value.anonymous || !includeAuthor) delete value.author
  return value
}
