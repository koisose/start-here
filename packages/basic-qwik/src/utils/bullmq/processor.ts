import { generateOgImage } from "../create-image";
// @ts-ignore
const jobProcessor = async (job) => {
  await job.log(`Started processing job with id ${job.id}`);

  if (job?.data?.jobName === "create-image") {
    await generateOgImage(job?.data?.id);
  }
  await job.updateProgress(100);
  return "DONE";
};

export default jobProcessor;
