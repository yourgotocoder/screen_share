window.ipcRenderer = require("electron").ipcRenderer;

window.onload = function() {
  ipcRenderer.on("uuid", (event, data) => {
    document.getElementById("code").innerText = data;
  });
};

function startShare() {
  ipcRenderer.send("start-share", {});
  console.log("Clicked");
  document.getElementById("start").style.display = "none";
  document.getElementById("stop").style.display = "block";
}

function stopShare() {
  ipcRenderer.send("stop-share", {});
  document.getElementById("stop").style.display = "none";
  document.getElementById("start").style.display = "block";
}
