import { connectToDb } from "./utils/db.ts";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.ts";
import cartRoutes from "./routes/cart.routes.ts";
import itemRoutes from "./routes/item.routes.ts";
import walletRoutes from "./routes/wallet.routes.ts";
import categoryRoutes from "./routes/category.routes.ts";
import menuRoutes from "./routes/menu.routes.ts";
import analyticsRoutes from "./routes/analytics.routes.ts";
import {startDailyReset} from "./utils/resetCategories.ts"

dotenv.config();

const app = express();

// console.log(require("crypto").randomBytes(64).toString("hex"))

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/admin/analytics", analyticsRoutes)

connectToDb();
startDailyReset();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server is running on port", port);
});
