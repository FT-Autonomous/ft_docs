import { clerkMiddleware } from "@clerk/astro/server";
import config from "../astro.config.mjs";

export const onRequest = config.output === "static"
  ? (context: any, next: Function) => next()
  : clerkMiddleware();
