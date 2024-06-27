const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors", {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(__dirname));
app.use(cors());

app.get("/view", (req, res) => {
  res.sendFile(__dirname + "/display.html");
});

io.on("connection", (socket) => {
  socket.on("join-message", (roomId) => {
    socket.join(roomId);
    console.log("User joined in a room " + roomId);
  });

  socket.on("screen-data", (data) => {
    finalData = JSON.parse(data);
    const room = finalData.room;
    const imgStr = finalData.image;
    socket.broadcast.to(room).emit("screen-data", imgStr);
  });
});

const port = 5000;

http.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
