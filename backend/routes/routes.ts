import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import cartRoutes from "./cart.routes.ts";
import orderRoutes from "./order.routes.ts";
import itemRoutes from "./item.routes.ts";
import walletRoutes from "./wallet.routes.ts";
import categoryRoutes from "./category.routes.ts";
import menuRoutes from "./menu.routes.ts";
import analyticsRoutes from "./analytics.routes.ts";
import customersRoutes from "./customers.routes.ts";

const appRouter = Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/customers", customersRoutes);
appRouter.use("/cart", cartRoutes);
appRouter.use("/order", orderRoutes);
appRouter.use("/items", itemRoutes);
appRouter.use("/category", categoryRoutes);
appRouter.use("/wallet", walletRoutes);
appRouter.use("/menu", menuRoutes);
appRouter.use("/admin/analytics", analyticsRoutes);

export default appRouter;
