export const normalizeEmail = value => typeof value === 'string' ? value.trim().toLowerCase() : ''
export const teacherEmailPattern = /^[a-z0-9._%+-]+@(?:teacher\.)?cuet\.ac\.bd$/
