const cp = require('child_process')
const fs = require('fs')
const path = require('path')

const cwd = process.cwd()
const tempIndex = path.join(cwd, '.codex-temp-index')
const env = { ...process.env, GIT_INDEX_FILE: tempIndex }

if (fs.existsSync(tempIndex)) {
  fs.unlinkSync(tempIndex)
}

cp.execFileSync('git', ['read-tree', 'origin/main'], { cwd, env, stdio: 'inherit' })

const q = String.fromCharCode(39)
const amp = String.fromCharCode(38)
const replacements = [
  [`title: ${q}Video${q}`, `title: ${q}Video Production ${amp} Editing${q}`],
  [
    `showcase.title === ${q}Video${q}`,
    `showcase.title === ${q}Video Production ${amp} Editing${q}`,
  ],
]

let app = cp.execFileSync('git', ['show', 'origin/main:src/App.tsx'], {
  cwd,
  encoding: 'utf8',
})

for (const [from, to] of replacements) {
  if (!app.includes(from)) {
    throw new Error(`Missing expected text: ${from}`)
  }
  app = app.replace(from, to)
}

const hash = cp
  .execFileSync('git', ['hash-object', '-w', '--stdin'], {
    cwd,
    input: app,
    encoding: 'utf8',
  })
  .trim()

cp.execFileSync('git', ['update-index', '--cacheinfo', '100644', hash, 'src/App.tsx'], {
  cwd,
  env,
  stdio: 'inherit',
})

const tree = cp.execFileSync('git', ['write-tree'], { cwd, env, encoding: 'utf8' }).trim()
const parent = cp.execFileSync('git', ['rev-parse', 'origin/main'], { cwd, encoding: 'utf8' }).trim()
const commit = cp
  .execFileSync('git', ['commit-tree', tree, '-p', parent, '-m', 'Update video section title'], {
    cwd,
    encoding: 'utf8',
  })
  .trim()

if (fs.existsSync(tempIndex)) {
  fs.unlinkSync(tempIndex)
}

console.log(commit)
