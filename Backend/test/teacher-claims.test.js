import test from 'node:test'
import assert from 'node:assert/strict'
import { User } from '../src/models/User.js'
import { TeacherClaim } from '../src/models/TeacherClaim.js'
import { createProfessor } from '../src/controllers/adminController.js'
import { login, verifyTeacher, register } from '../src/controllers/authController.js'
import { normalizeEmail, teacherEmailPattern } from '../src/utils/teacherIdentity.js'
import { sendTeacherVerification } from '../src/utils/email.js'
const invoke = async (handler, body) => {
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this }, json(body) { this.body = body; return this } }
  await handler({ body }, res, error => { throw error })
  return res
}
test('CUET normalization and domain boundaries', () => {
  assert.equal(normalizeEmail(' Name@CUET.AC.BD '), 'name@cuet.ac.bd')
  for (const email of ['name@cuet.ac.bd', 'u1001@teacher.cuet.ac.bd']) assert.ok(teacherEmailPattern.test(email))
  for (const email of ['name@cuet.ac.bd.evil.com', 'u1@student.cuet.ac.bd', 'x@gmail.com']) assert.ok(!teacherEmailPattern.test(email))
})
test('admin creates a passwordless unclaimed profile', async t => {
  t.mock.method(User, 'create', async data => { assert.equal(data.accountStatus, 'unclaimed'); assert.equal(data.passwordHash, undefined); return new User(data) })
  const res = await invoke(createProfessor, { name: 'Teacher', email: ' NAME@CUET.AC.BD ', department: 'CSE' })
  assert.equal(res.statusCode, 201)
  assert.equal(res.body.professor.email, 'name@cuet.ac.bd')
  assert.equal(res.body.professor.validateSync(), undefined)
})
test('unclaimed profiles cannot log in', async t => {
  t.mock.method(User, 'findOne', () => ({ select: async () => ({ accountStatus: 'unclaimed' }) }))
  assert.equal((await invoke(login, { email: 'name@cuet.ac.bd', password: 'anything' })).statusCode, 401)
})
test('expired or incorrect claim cannot issue a session', async t => {
  t.mock.method(TeacherClaim, 'findOne', query => { assert.ok(query.expiresAt.$gt instanceof Date); return { select: async () => null } })
  assert.equal((await invoke(verifyTeacher, { email: 'name@cuet.ac.bd', code: 'a'.repeat(64) })).statusCode, 400)
})
test('verified claim keeps the original profile identity and admin metadata', async t => {
  process.env.JWT_SECRET = 'test-only-secret'
  const original = new User({ name: 'Admin name', email: 'name@cuet.ac.bd', department: 'CSE', role: 'teacher', accountStatus: 'unclaimed' })
  t.mock.method(TeacherClaim, 'findOne', () => ({ select: async () => ({ id: 'claim', passwordHash: 'hash', name: 'Other name', department: 'EEE' }) }))
  t.mock.method(User, 'findOne', async () => original)
  t.mock.method(User, 'findOneAndUpdate', async (filter, update) => {
    assert.equal(filter._id, original.id); assert.equal(filter.active, true); assert.equal(filter.accountStatus, 'unclaimed')
    assert.equal(update.$set.name, undefined); assert.equal(update.$set.department, undefined)
    Object.assign(original, update.$set); return original
  })
  t.mock.method(TeacherClaim, 'deleteOne', async () => ({}))
  const res = await invoke(verifyTeacher, { email: 'name@cuet.ac.bd', code: 'a'.repeat(64) })
  assert.equal(res.body.user.id, original.id); assert.equal(res.body.user.name, 'Admin name'); assert.ok(res.body.token)
  assert.equal(res.body.user.toJSON().passwordHash, undefined)
})
test('already claimed or disabled profiles cannot be claimed again', async t => {
  t.mock.method(TeacherClaim, 'findOne', () => ({ select: async () => ({ passwordHash: 'hash' }) }))
  t.mock.method(User, 'findOne', async () => ({ id: 'existing' }))
  t.mock.method(User, 'findOneAndUpdate', async () => null)
  assert.equal((await invoke(verifyTeacher, { email: 'name@cuet.ac.bd', code: 'a'.repeat(64) })).statusCode, 409)
})
test('existing accounts cannot be overwritten by registration', async t => {
  t.mock.method(User, 'findOne', async () => ({ role: 'teacher', accountStatus: 'claimed' }))
  assert.equal((await invoke(register, { name: 'Teacher', email: 'name@cuet.ac.bd', password: 'Strong123!', role: 'teacher', department: 'CSE' })).statusCode, 409)
})
test('missing mail configuration fails closed', async () => {
  delete process.env.SMTP_HOST
  await assert.rejects(sendTeacherVerification('name@cuet.ac.bd', 'code'), { statusCode: 503 })
})
