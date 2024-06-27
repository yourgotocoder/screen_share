const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { v4: uuidv4 } = require("uuid");
const screenshot = require("screenshot-desktop");

const socket = require("socket.io-client")("http://172.16.0.133:5000");
let interval;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 150,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("start-share", (event, arg) => {
  let uuid = uuidv4();
  socket.emit("join-message", uuid);
  event.reply("uuid", uuid);
  // Take continuous screenshots
  interval = setInterval(() => {
    screenshot()
      .then((img) => {
        const imgStr = new Buffer(img).toString("base64");
        const obj = { room: uuid, image: imgStr };
        socket.emit("screen-data", JSON.stringify(obj));
      })
      .catch((err) => console.log(err));
  }, 100);
  // Broadcast to all other users
});

ipcMain.on("stop-share", (event, arg) => {
  // Stop broadcast
});
