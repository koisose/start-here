import { type RequestHandler } from "@builder.io/qwik-city";
import { metadata } from "~/utils/metadata";
import { encodeToHex } from "~/utils/encode";
export const onPost: RequestHandler = async ({ parseBody, html,url }) => {
   const po = await parseBody();
    const meta = metadata({
    frameInputText: "say something",
    title: "farcaster",
    description: "frame",
    ogImage: `https://${url.host}/say/og-image/${encodeToHex((po as any).untrustedData.inputText)}`,
    twitterSite: "@koisose_",
    ogImageType: "image/png",
    button:[{buttonNumber:"1",text:"submit"}],
   framePostUrl:`https://${url.host}/say/post`
  }).meta;
 
  html(
    200,
    `<html>
  <head>${meta
    .map((obj) => {
      const [key1, value1] = Object.entries(obj)[0]; 
      const [key2, value2] = Object.entries(obj)[1]; 
      return `<meta ${key1}="${value1}" ${key2}="${value2}" />`;
    })
    .join("")}</head>
  <body>
  daw</body>
  </html>`,
  );
};
