import { connectToDb } from "./utils/db.ts";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import appRouter from "./routes/routes.ts";
import { startDailyReset } from "./utils/resetCategories.ts";
import { Server } from "socket.io";

dotenv.config();

const app = express();

// console.log(require("crypto").randomBytes(64).toString("hex"))

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", appRouter);

connectToDb();
startDailyReset();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("server is running on port", port);
});

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);
});
