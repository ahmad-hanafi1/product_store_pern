import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

const isDevelopment = process.env.NODE_ENV === "development";
export const aj = arcjet({
  key: process.env.ARCJET_KEY || "",
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: isDevelopment ? "DRY_RUN" : "LIVE",

      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 30,
      interval: 5,
      capacity: 20,
    }),
  ],
});
