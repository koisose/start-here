import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { execSync, spawn } from "child_process";
import { confirm } from '@clack/prompts';
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI();

const API_KEY = process.env.GOOGLE_API_KEY; // Replace with your actual API key
const systemMessage = `You are a commit message generator by creating exactly one commit message by the diff strings without adding unnecessary information! Here is the format of a good commit message from https://karma-runner.github.io/6.4/dev/git-commit-msg.html guides:

---
<emoji> <type>(<scope>): <subject>
<body>

Indonesian translation:
---

With allowed <type> values are feat, fix, perf, docs, style, refactor, test, and build. After creating commit message, translate the commit message to indonesian language and put it below \`Indonesian translation:\` text. And here's an example of a good commit message:

---
📝 docs(README): Add web demo and Clarifai project.
Adding links to the web demo and Clarifai project page to the documentation. Users can now access the GPT-4 Turbo demo application and view the Clarifai project through the provided links.

Indonesian translation:

📝 docs(README): tambah demo web dan proyek Clarifai.
Menambahkan tautan demo web dan halaman proyek Clarifai ke dalam dokumentasi. Pengguna kini dapat mengakses demo aplikasi GPT-4 Turbo dan melihat proyek Clarifai melalui tautan yang disediakan.
---

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

async function main() {
  try {
    execSync(`cd ../../ && bash add-first-untracked.sh`);
    const diffString = await gitDiffStaged();
    if (!diffString.trim()) {
      throw { status: 5001, message: "No changes to commit" };
    }
    const completion = await openai.chat.completions.create({
      messages: [{"role": "system", "content": systemMessage},
          {"role": "user", "content": diffString}],
      model: "gpt-4",
    });
  
        
    const text = completion.choices[0].message.content;
    let text2=text.replace(/```/g, '');
    let text3=text2.replace(/---/g, '')
    let text4=text3.replace(/\"/gi, "\\\"")
    let text5=text4.replace(/\`/gi, "\\`");
    let text6=text5.replace(/\'/gi, "\\'");
    console.log(text6)


    const shouldContinue = await confirm({
      message: 'Do you want to push?',
    });
    if(shouldContinue){
      execSync(`git add -A`);
      execSync(`printf "${text6}" | git commit -F-`);
      execSync("git push -u origin main");
    }else{
      execSync(`git reset`);
    }

    process.exit();
  } catch (e) {
    console.log(e.message);
    execSync(`git reset`);
    process.exit();
  }
  
}
main();