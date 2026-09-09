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
  base: command === 'build' ? '/roozaneh/' : '/',
  // demo output must not clobber the library's dist/ folder
  build: {
    outDir: 'demo-dist'
  },
  resolve: {
    alias: {
      // the demo consumes the react connector source directly ( hmr friendly )
      roozaneh: path.join(__dirname, '/src/index.ts'),
      '@roozaneh/basic-grid': path.join(
        __dirname,
        '/node_modules/@roozaneh/daily-grid/node_modules/@roozaneh/basic-grid/dist/index.js'
      ),
      '@roozaneh/daily-grid': path.join(__dirname, '/node_modules/@roozaneh/daily-grid/dist/index.js'),

      '@roozaneh/group-grid': path.join(
        __dirname,
        '/node_modules/@roozaneh/weekly-grid/node_modules/@roozaneh/group-grid/dist/index.js'
      ),
      // '@roozaneh/utils': path.join(
      //   __dirname,
      //   '/node_modules/@roozaneh/core/node_modules/@roozaneh/utils/dist/index.js'
      // ),

      '@full-event-css-core': path.join(__dirname, '/node_modules/@roozaneh/core/dist/index.css'),
      '@full-event-css-basic': path.join(
        __dirname,
        '/node_modules/@roozaneh/daily-grid/node_modules/@roozaneh/basic-grid/dist/index.css'
      ),
      '@full-event-css-daily': path.join(__dirname, '/node_modules/@roozaneh/daily-grid/dist/index.css'),
      '@full-event-css-month': path.join(__dirname, '/node_modules/@roozaneh/month-grid/dist/index.css'),
      '@full-event-css-week': path.join(__dirname, '/node_modules/@roozaneh/weekly-grid/dist/index.css'),
      // '@roozaneh/core': path.join(__dirname, '/node_modules/@roozaneh/core/dist/index.js'),
      '@roozaneh/locale': path.join(__dirname, '/node_modules/@roozaneh/locale/dist/index.js'),
      '@roozaneh/weekly-grid': path.join(__dirname, '/node_modules/@roozaneh/weekly-grid/dist/index.js'),
      '@roozaneh/month-grid': path.join(__dirname, '/node_modules/@roozaneh/month-grid/dist/index.js')
    }
  }
}))
