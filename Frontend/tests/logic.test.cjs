const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

// Exercise the actual handlers with deterministic hooks, storage, and timers.
// This is not a browser rendering or end-to-end API test.
function load(relativePath, { stored = {}, app = {} } = {}) {
  const state = []
  let cursor = 0
  const storage = new Map(Object.entries(stored))
  const react = {
    createContext: () => ({ Provider: 'Provider' }),
    useContext: () => app,
    useState: initial => {
      const index = cursor++
      if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial
      return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value }]
    },
    useEffect: () => {},
  }
  const sandbox = {
    exports: {},
    require: name => {
      if (name === 'react') return react
      if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) }
      if (name.endsWith('context')) return { useApp: () => app }
      return new Proxy({}, { get: (_, key) => key })
    },
    sessionStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key),
    },
    setTimeout: callback => callback(),
  }
  const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  })
  vm.runInNewContext(outputText, sandbox)
  return name => { cursor = 0; return sandbox.exports[name]({ children: null }) }
}

function find(node, predicate) {
  if (!node || typeof node !== 'object') return undefined
  if (predicate(node)) return node
  const children = node.props?.children
  for (const child of Array.isArray(children) ? children.flat(Infinity) : [children]) {
    const found = find(child, predicate)
    if (found) return found
  }
}

for (const [email, password, expected] of [
  ['u999999@student.cuet.ac.bd', 'Pass@1234', undefined],
  ['u999999@teacher.cuet.ac.bd', 'Pass@1234', undefined],
  [' U2204061@STUDENT.CUET.AC.BD ', 'Pass@1234', 'student'],
  ['u1001@teacher.cuet.ac.bd', 'wrong', undefined],
  ['ADMIN@CUET.AC.BD', 'Admin@1234', 'admin'],
]) {
  test(`demo login: ${email} / ${expected ?? 'denied'}`, () => {
    let loggedIn
    const render = load('src/pages/Auth.tsx', { app: { login: role => { loggedIn = role } } })
    const tree = render('Login')
    find(tree, node => node.props?.label === 'Email address').props.onChange({ target: { value: email } })
    find(tree, node => node.props?.label === 'Password').props.onChange({ target: { value: password } })
    find(render('Login'), node => node.type === 'form').props.onSubmit({ preventDefault() {} })
    assert.equal(loggedIn, expected)
  })
}

test('restored role cannot display another role page', () => {
  const render = load('src/context.tsx', { stored: { bhorosha_role: 'student', bhorosha_view: 'admin-users' } })
  assert.equal(render('AppProvider').props.value.view, 'landing')
})

test('invalid stored roles and views fall back safely', () => {
  const render = load('src/context.tsx', { stored: { bhorosha_role: 'owner', bhorosha_view: 'missing' } })
  const value = render('AppProvider').props.value
  assert.equal(value.role, 'guest')
  assert.equal(value.view, 'landing')
})

test('teacher signup and navigation parameters survive restoration', () => {
  const render = load('src/context.tsx', { stored: {
    bhorosha_view: 'otp', bhorosha_signup_role: 'teacher', bhorosha_nav_params: '{"tab":"My Questions"}',
  } })
  const value = render('AppProvider').props.value
  assert.equal(value.signupRole, 'teacher')
  assert.equal(value.view, 'otp')
  assert.equal(value.navParams.tab, 'My Questions')
})

test('signup without a selected role returns to role selection', () => {
  const render = load('src/context.tsx', { stored: { bhorosha_view: 'signup' } })
  assert.equal(render('AppProvider').props.value.view, 'role-select')
})

test('role-scoped navigation is guarded and logout clears signup context', () => {
  const render = load('src/context.tsx', { stored: { bhorosha_role: 'student', bhorosha_signup_role: 'teacher' } })
  render('AppProvider').props.value.navigate('teacher-dashboard')
  assert.equal(render('AppProvider').props.value.view, 'landing')
  render('AppProvider').props.value.logout()
  assert.equal(render('AppProvider').props.value.signupRole, null)
  assert.equal(render('AppProvider').props.value.role, 'guest')
})
