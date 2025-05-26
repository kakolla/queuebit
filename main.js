const { app, BrowserWindow, ipcMain } = require('electron')
const { Tray, Menu, nativeImage } = require('electron')
const path = require('path')
require('dotenv').config()
const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

let tray = null
let win = null

const createWindow = () => {
    win = new BrowserWindow({
        width: 400,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        },
        alwaysOnTop: true
    })

    // OpenAI IPC handler
    ipcMain.handle('generate-question', async (_, notes) => {
        try {
            const completion = await openai.chat.completions.create({
                messages: [{
                    role: "system",
                    content: "Generate one concise multiple-choice question with 4 options and mark the correct answer. Format: 'Question: ...\nA) ...\nB) ...\nC) ...\nD) ...\nAnswer: ...'"
                }, {
                    role: "user",
                    content: notes
                }],
                model: "gpt-3.5-turbo",
                max_tokens: 200
            })
            
            return completion.choices[0].message.content
        } catch (error) {
            console.error('OpenAI Error:', error)
            return '❌ Error generating question. Please try again.'
        }
    })

    // Tray icon setup
    const icon = nativeImage.createFromDataURL('data:image/png;base64,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')
    icon.setTemplateImage(true)
    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => win.show() },
        { type: 'separator' },
        { role: 'quit' }
    ])
    tray.setToolTip('Queuebit Quiz Generator')
    tray.setContextMenu(contextMenu)

    // Tray click handler
    tray.on('click', () => {
        if (win.isVisible()) {
            win.hide()
        } else {
            win.show()
        }
    })

    win.loadFile('index.html')

    // Dev tools (uncomment for debugging)
    // win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })

    return win
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})