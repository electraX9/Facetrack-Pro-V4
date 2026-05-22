const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')
const http     = require('http')
const fs       = require('fs')
const path     = require('path')

// ── Internal HTTP file server ─────────────────────────────────────────────────
// WHY: Electron's file:// protocol blocks dynamic ES module imports
// (.mjs files like vision_bundle.mjs).  Serving from http://127.0.0.1
// with correct MIME types fixes this completely.
const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.js'   : 'text/javascript',
  '.mjs'  : 'text/javascript',          // CRITICAL for ES module imports
  '.cjs'  : 'text/javascript',
  '.css'  : 'text/css',
  '.json' : 'application/json',
  '.wasm' : 'application/wasm',         // CRITICAL for MediaPipe WASM
  '.task' : 'application/octet-stream', // MediaPipe model files
  '.bin'  : 'application/octet-stream',
  '.png'  : 'image/png',
  '.ico'  : 'image/x-icon',
  '.svg'  : 'image/svg+xml',
  '.ttf'  : 'font/ttf',
  '.woff2': 'font/woff2',
}

const PORT = 3847  // internal only — not exposed outside localhost
const ROOT = __dirname

const fileServer = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0])
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html'

  const filePath = path.join(ROOT, urlPath)

  // Security: only serve files inside the app directory
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return
  }

  const ext = path.extname(filePath).toLowerCase()

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found: ' + urlPath)
      return
    }
    res.writeHead(200, {
      'Content-Type'                  : MIME[ext] || 'application/octet-stream',
      'Cross-Origin-Opener-Policy'    : 'same-origin',
      'Cross-Origin-Embedder-Policy'  : 'require-corp',
      'Cache-Control'                 : 'no-store',
    })
    res.end(data)
  })
})

fileServer.listen(PORT, '127.0.0.1', () => {
  console.log(`[FaceTrack] Internal server ready on http://127.0.0.1:${PORT}`)
})

// ── Electron window ───────────────────────────────────────────────────────────
let win

function createWindow () {
  win = new BrowserWindow({
    width       : 1300,
    height      : 820,
    minWidth    : 920,
    minHeight   : 640,
    title       : 'FaceTrack Pro v4.0',
    backgroundColor: '#070712',
    webPreferences: {
      nodeIntegration  : false,
      contextIsolation : true,
      preload          : path.join(__dirname, 'preload.js'),
      // webSecurity stays true — HTTP server gives us correct origins
    }
  })

  // Load from internal HTTP server (not file://)
  win.loadURL(`http://127.0.0.1:${PORT}`)
  win.setMenuBarVisibility(false)

  win.on('closed', () => { win = null })
}

// ── System-wide scroll (Windows mouse_event API) ──────────────────────────────
// Scrolls whatever window is currently under the mouse cursor.
// Works in Chrome, Edge, Firefox, Word, Excel, VS Code — every app.
ipcMain.on('sys-scroll', (_e, delta) => {
  const d   = Math.round(delta * 120)   // 120 = one wheel notch
  const cmd =
    `Add-Type -TypeDefinition 'using System;using System.Runtime.InteropServices;` +
    `public class ME{[DllImport("user32.dll")]` +
    `public static extern void mouse_event(uint f,int x,int y,int d,IntPtr e);}';` +
    `[ME]::mouse_event(0x800,0,0,${d},[IntPtr]::Zero)`
  exec(
    `powershell -NoProfile -NonInteractive -WindowStyle Hidden -Command "${cmd}"`,
    { windowsHide: true }
  )
})

// Always-on-top toggle
ipcMain.on('set-topmost', (_e, val) => {
  if (win) win.setAlwaysOnTop(val, 'floating')
})

// ── App lifecycle ─────────────────────────────────────────────────────────────
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  fileServer.close()
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
