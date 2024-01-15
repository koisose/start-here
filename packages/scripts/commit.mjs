import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { execSync, spawn } from "child_process";

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY; // Replace with your actual API key
const systemMessage = `You are a commit message generator by creating exactly one commit message by the diff strings without adding unnecessary information! Here is the format of a good commit message from https://karma-runner.github.io/6.4/dev/git-commit-msg.html guides:

---
<emoji> <type>(<scope>): <subject>
<body>
---

With allowed <type> values are feat, fix, perf, docs, style, refactor, test, and build. Translate the commit <subject> and <body> to indonesian language.

create commit message from this git diff:`;
const genAI = new GoogleGenerativeAI(API_KEY);

async function gitDiffStaged() {
  const child = spawn("git", ["diff", "--staged"]);

  const output = await new Promise((resolve, reject) => {
    let stdout = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Git command failed with exit code ${code}`));
      }
    });
    child.stderr.on("data", (data) => {
      console.error(data.toString());
    });
  });

  return output;
}
async function run() {
  try {
    execSync(`cd ../../ && bash add-first-untracked.sh`);
    const diffString = await gitDiffStaged();
    if (!diffString.trim()) {
      throw { status: 5001, message: "No changes to commit" };
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let modifiedDiffString = diffString;
    let modifiedPrompt = `${systemMessage}
        ${modifiedDiffString}
        `;
// console.log(modifiedPrompt)
    const result = await model.generateContent(modifiedPrompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    execSync(`git add -A`);
    execSync(`printf "${text.replace(/\`/gi, "\\`")}" | git commit -F-`);
    execSync("git push -u origin main");
    process.exit();
  } catch (e) {
    console.log(e.message);
    execSync(`git reset`);
    process.exit();
  }
}

run();
