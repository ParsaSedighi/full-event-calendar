import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function workspaceDistReload(): Plugin {
  const repoRoot = path.resolve(__dirname, '../..')
  let timer: NodeJS.Timeout | undefined
  const isPackageDist = (file: string) =>
    file.startsWith(`${repoRoot}${path.sep}packages${path.sep}`) && file.includes(`${path.sep}dist${path.sep}`)
  return {
    name: 'workspace-dist-full-reload',
    apply: 'serve',
    configureServer(server) {
      const schedule = () => {
        clearTimeout(timer)
        // debounce : a build rewrites every dist file of every package
        timer = setTimeout(() => {
          console.log('[vite] package dist changed - full reload')
          server.ws.send({ type: 'full-reload' })
        }, 150)
      }
      const onFile = (file: string) => {
        if (isPackageDist(file)) schedule()
      }
      server.watcher.on('change', onFile)
      server.watcher.on('add', onFile)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), workspaceDistReload()],
  base: command === 'build' ? '/full-event-calendar/' : '/',
  resolve: {
    alias: {
      '@full-event-calendar/basic-grid': path.join(
        __dirname,
        '/node_modules/@full-event-calendar/daily-grid/node_modules/@full-event-calendar/basic-grid/dist/index.js'
      ),
      '@full-event-calendar/daily-grid': path.join(
        __dirname,
        '/node_modules/@full-event-calendar/daily-grid/dist/index.js'
      ),

      '@full-event-calendar/group-grid': path.join(
        __dirname,
        '/node_modules/@full-event-calendar/weekly-grid/node_modules/@full-event-calendar/group-grid/dist/index.js'
      ),
      // '@full-event-calendar/utils': path.join(
      //   __dirname,
      //   '/node_modules/@full-event-calendar/core/node_modules/@full-event-calendar/utils/dist/index.js'
      // ),

      '@full-event-css-core': path.join(__dirname, '/node_modules/@full-event-calendar/core/dist/index.css'),
      '@full-event-css-basic': path.join(
        __dirname,
        '/node_modules/@full-event-calendar/daily-grid/node_modules/@full-event-calendar/basic-grid/dist/index.css'
      ),
      '@full-event-css-daily': path.join(__dirname, '/node_modules/@full-event-calendar/daily-grid/dist/index.css'),
      '@full-event-css-month': path.join(__dirname, '/node_modules/@full-event-calendar/month-grid/dist/index.css'),
      '@full-event-css-week': path.join(__dirname, '/node_modules/@full-event-calendar/weekly-grid/dist/index.css'),
      // '@full-event-calendar/core': path.join(__dirname, '/node_modules/@full-event-calendar/core/dist/index.js'),
      '@full-event-calendar/weekly-grid': path.join(
        __dirname,
        '/node_modules/@full-event-calendar/weekly-grid/dist/index.js'
      ),
      '@full-event-calendar/month-grid': path.join(
        __dirname,
        '/node_modules/@full-event-calendar/month-grid/dist/index.js'
      )
    }
  }
}))
