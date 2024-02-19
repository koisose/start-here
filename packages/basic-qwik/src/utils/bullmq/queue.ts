// addJobToQueue.ts
import { Queue } from "bullmq";
import { CONNECTOR, DEFAULT_REMOVE_CONFIG } from "./config";
import setUpWorker from "./worker";
import {Redis} from "ioredis";
let ready=false;
// @ts-ignore
let myQueue;

// @ts-ignore
const addJobToQueue = (data) => {
     // @ts-ignore

  if(ready){
    // @ts-ignore
    return myQueue.add(data.jobName, data, DEFAULT_REMOVE_CONFIG);
  }else{
    const connection = new Redis(CONNECTOR as any);
myQueue = new Queue("JOBS", { connection });
myQueue.on("error", () => {
  connection.disconnect();
});
connection.on("connect", function () {
     // @ts-ignore
  myQueue.setMaxListeners(Number(myQueue.getMaxListeners()) + 100);
  setUpWorker();
  console.log("Redis client connected");
});

connection.on("error", function () {
  //  console.log('Something went wrong ' + err);
  connection.disconnect();
});
ready=true;
return myQueue.add(data.jobName, data, DEFAULT_REMOVE_CONFIG);
  }
  
};

export default addJobToQueue;