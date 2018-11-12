import { resolve, join, parse } from 'path'
import { readdirSync, existsSync } from 'fs'
import { requireModule } from './utils'
import NuxtCommand from './command'

const filterCommands = (dir) => {
  return readdirSync(dir).filter(c => c.endsWith('.js'))
}

export function getLocalCommands() {
  const cmdsRoot = resolve('.', 'commands')
  const cmds = filterCommands(cmdsRoot)
  return cmds.reduce((hash, cmd) => {
    return Object.assign(hash, {
      [parse(cmd).name]: () => requireModule(join(cmdsRoot, cmd))
    })
  }, {})
}

export function localCommandExists(cmd) {
  const cmdsRoot = resolve('.', 'commands')
  if (existsSync(cmdsRoot)) {
    return filterCommands(cmdsRoot).includes(`${cmd}.js`)
  }
}

export async function localCommandLoad(cmd) {
  const cmdsRoot = resolve('.', 'commands')
  const file = filterCommands(cmdsRoot).find((c) => {
    return parse(c).name === cmd
  })
  const command = requireModule(join(cmdsRoot, file))
  return NuxtCommand.from(command.default)
}
