import { rmSync } from 'node:fs'
import { spawn } from 'node:child_process'
import net from 'node:net'

try {
  rmSync('node_modules/.vite', { recursive: true, force: true })
} catch {
  /* ignore */
}

const forwardedArgs = process.argv.slice(2)
const hasFlagStyleArgs = forwardedArgs.some((arg) => arg.startsWith('-'))
const viteArgs = ['vite']
let requestedPort = null

if (hasFlagStyleArgs) {
  viteArgs.push(...forwardedArgs)
} else if (forwardedArgs.length === 1) {
  viteArgs.push('--host', forwardedArgs[0])
} else if (forwardedArgs.length >= 2) {
  viteArgs.push('--host', forwardedArgs[0], '--port', forwardedArgs[1])
  requestedPort = Number(forwardedArgs[1])
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.unref()
    server.on('error', () => resolve(false))
    server.listen({ port, exclusive: true }, () => {
      server.close(() => resolve(true))
    })
  })
}

async function findFreePort(startPort) {
  for (let port = startPort; port < startPort + 100; port += 1) {
    if (await isPortFree(port)) {
      return port
    }
  }
  return startPort
}

if (requestedPort == null) {
  const freePort = await findFreePort(5173)
  viteArgs.push('--port', String(freePort))
}

const child = spawn('npx', viteArgs, {
  stdio: 'inherit',
  shell: true,
})

child.on('exit', (code) => process.exit(code ?? 0))
