
const PAT = process.env.CLARIFAI_API_KEY;
const { execSync, spawn } = require("child_process");
const USER_ID = 'openai';
const APP_ID = 'chat-completion';
// Change these to whatever model and text URL you want to use
const MODEL_ID = 'gpt-4-turbo';
const MODEL_VERSION_ID = '182136408b4b4002a920fd500839f2c8';



const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

// To use a local text file, uncomment the following lines
// const fs = require("fs");
// const fileBytes = fs.readFileSync(TEXT_FILE_LOCATION);
const systemMessage = `You are a commit message generator by creating exactly one commit message by the diff strings without adding unnecessary information! Here is the format of a good commit message from https://karma-runner.github.io/6.4/dev/git-commit-msg.html guides:

---
<emoji> <type>(<scope>): <subject>
<body>
---

With allowed <type> values are feat, fix, perf, docs, style, refactor, test, and build. Translate the commit <subject> and <body> to indonesian language. And here's an example of a good commit message:

---
✨ feat(README): tambah instruksi penggunaan Clarifai untuk pesan commit

Menambahkan bagian tentang penggunaan Clarifai untuk penerjemahan pesan commit yang lebih kuat ke dalam bahasa Indonesia. Pengguna harus menempatkan \`CLARIFAI_API_KEY\` di dalam file \`.env\` dan menjalankan perintah \`pnpm run commit-clarifai\`.
---

create commit message from this git diff:`;

function postModelOutputsPromise(input) {
    return new Promise((resolve, reject) => {
        stub.PostModelOutputs(
            {
                user_app_id: {
                    "user_id": USER_ID,
                    "app_id": APP_ID
                },
                model_id: MODEL_ID,
                version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version.
                inputs: [
                    {
                        "data": {
                            "text": {
                                "raw": `${systemMessage}
                                ${input}`
                                
                            }
                        }
                    }
                ]
            },
            metadata,
            (err, response) => {
                if (err) {
                    reject(err);
                } else if (response.status.code !== 10000) {
                    reject(new Error("Post model outputs failed, status: " + response.status.description));
                } else {
                    // Since we have one input, one output will exist here.
                          

                    resolve(response);
                }
            }
        );
    });
}

// Using the promise

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
      
  
      
      const text=await postModelOutputsPromise(diffString)
      console.log(text.outputs[0].data.text.raw);
      let text2=text.outputs[0].data.text.raw.replace(/\`/gi, "\\`");
      let text3=text2.replace(/---/g, '')
      let text4=text3.replace(/\"/gi, "\\\"")
    //   execSync(`git reset`);
    //   console.log(text3)
      execSync(`git add -A`);
      execSync(`printf "${text4.replace(/```/g, '')}" | git commit -F-`);
      execSync("git push -u origin main");
      process.exit();
    } catch (e) {
      console.log(e.message);
      execSync(`git reset`);
      process.exit();
    }
  }
  
  run();
  