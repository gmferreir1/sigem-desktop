import { app, BrowserWindow, ipcMain, Menu } from "electron";
const PDFWindow = require("electron-pdf-window");
const ipc = require('electron').ipcRenderer;
const path = require('path');
const log = require("electron-log");

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;


function createWindow() {

  mainWindow = new BrowserWindow({

    width: 1200,
    height: 768,
    minWidth: 1200,
    minHeight: 768,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    },
    icon: path.join(__dirname, '../renderer/assets/icons/icon_app.png')
  });

  //mainWindow.maximize();
  mainWindow.loadURL(winURL);

  //mainWindow.openDevTools()

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  //require("../renderer/electronApp/menu");

  mainWindow.setMenuBarVisibility(false);
  ipcMain.on('close-event', function (e) {
    e.sender.getOwnerBrowserWindow().close()
  })


  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  })


}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow.webContents.send('aplicationClosed');
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

import { autoUpdater } from 'electron-updater'

/*
ipcMain.on('checkUpdates', (event, data) => {



  autoUpdater.on("update-not-available", () => {
    event.sender.send('updateNotAvailable');
  })

  autoUpdater.on("update-available", () => {
    event.sender.send('updateAvailable');
  })

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';

    event.sender.send('downloadProgress', log_message);
  })


  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
  })

})
*/

function checkUpdate() {

  log.info("Verificando atualização ...");

  autoUpdater.checkForUpdates();

  autoUpdater.on('update-available', (info) => {
    log.info(`Update Available: ${info}`);
    mainWindow.webContents.send('downloadProgress');
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info(`Update Not Available: ${info}`);
    mainWindow.webContents.send('updateChecked');
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info(`Update Downloaded: ${info}`);
    mainWindow.webContents.send('quitAndInstall');
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('error', (info) => {
    log.info(`Erro ao atualizar APP: ${info}`);
    mainWindow.webContents.send('updateChecked');
  });

}

ipcMain.on("checkUpdate", () => {
  checkUpdate();
})



if (process.env.NODE_ENV === 'production') {
  //autoUpdater.updateConfigPath = path.join("/home/guilherme/Programing/mwd-restaurant/electron/app-update.yml");
  autoUpdater.checkForUpdates();
}









/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
