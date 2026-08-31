import blockedWords from '../data/profanity.json'

const escapedWords = blockedWords
  .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .sort((a, b) => b.length - a.length)
const pattern = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi')

export function censorProfanity(text: string) {
  return text.replace(pattern, match => '*'.repeat([...match].length))
}
