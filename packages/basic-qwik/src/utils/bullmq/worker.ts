// setUpWorker.js
import { Worker } from "bullmq";
import { CONNECTOR } from "./config";
import jobProcessor from "./processor";
import { type ConnectionOptions } from "bullmq";
let worker: Worker;

const setUpWorker = () => {
  worker = new Worker("JOBS", jobProcessor, {
    connection: CONNECTOR as ConnectionOptions,
    autorun: true,
  });

  worker.on("active", (job) => {
    console.debug(`Processing job with id ${job?.id}`);
  });

  worker.on("completed", (job, returnValue) => {
    console.debug(`Completed job with id ${job?.id}`, returnValue);
  });
  worker.on("failed", (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
  });
  worker.on("error", (failedReason) => {
    console.error(`Job encountered an error`, failedReason);
  });
};

export default setUpWorker;