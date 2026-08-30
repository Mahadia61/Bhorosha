import blockedWords from '../data/profanity.json' with { type: 'json' }

const escapedWords = blockedWords
  .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .sort((a, b) => b.length - a.length)

const blockedWordPattern = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi')

export function censorProfanity(text) {
  if (typeof text !== 'string') return text
  return text.replace(blockedWordPattern, match => '*'.repeat([...match].length))
}
