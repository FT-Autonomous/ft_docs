import { clerkMiddleware } from "@clerk/astro/server";
import config from "../astro.config.mjs";

export const onRequest = process.env.FT_DOCS_FORCE_AUTH == '1'
  ? clerkMiddleware()
  : (context: any, next: Function) => next();
