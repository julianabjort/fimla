import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import config from "./config/default";
import cors from "cors";

const port = 3000;
const host = "localhost";
const corsOrigin = "http://localhost:3000";

// const port = config.get<number>("port");
// const host = config.get<string>("host");
// const corsOrigin = config.get<string>("corsOrigin");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

app.get("/", (_, res) => {
  res.send("server is up");
});

app.listen(port, host, () => {
  console.log("listening on *:3000");
});
