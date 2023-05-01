import express from "express";

import * as dotenv from 'dotenv'
dotenv.config()

import {
  addAlchemyContextToRequest,
  validateAlchemySignature,
  AlchemyWebhookEvent,
} from "./webhooksUtil";

async function main(): Promise<void> {
  const app = express();

  let port = process.env.PORT;
  let host = process.env.HOST;
  let signingKey = process.env.SIGNING_KEY;

  // Middleware needed to validate the alchemy signature
  app.use(
    express.json({
      verify: addAlchemyContextToRequest,
    })
  );
  // @ts-ignore
  app.use(validateAlchemySignature(signingKey));

  // Register handler for Alchemy Notify webhook events
  app.post("/webhook", (req, res) => {
    const webhookEvent = req.body as AlchemyWebhookEvent;
    // Do stuff with with webhook event here!
    console.log(`Processing webhook event id: ${webhookEvent.id}`);
    // Be sure to respond with 200 when you successfully process the event
    res.send("Alchemy Notify is the best!");
  });

  // Register handler for Alchemy Notify webhook events
  app.get("/test", (_, res) => {
    console.log("test");
    // Be sure to respond with 200 when you successfully process the event
    res.send("Alchemy Notify is the best!");
  });

  // Listen to Alchemy Notify webhook events
  // @ts-ignore
  app.listen(port, host, () => {
    console.log(`Example Alchemy Notify app listening at ${host}:${port}`);
  });
}

main();
