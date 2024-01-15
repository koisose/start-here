
# Whats this?

There's an auto commit in [packages/scripts/commit.mjs](packages/scripts/) put `GOOGLE_API_KEY=` in `.env`
and run the auto commit with `pnpm run commit` , this is using gemini pro free version, which means that
all your input data will be recorded by google, for their training, the commit message is indonesian you
can run the english version by using `commit-en.mjs`


# How to use clarifai GPT-4

`export CLARIFAI_API_KEY=<your CLARIFAI_API_KEY>` then run `pnpm run commit-clarifai`