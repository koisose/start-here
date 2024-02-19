import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { metadata } from "~/utils/metadata";
import { encodeToHex } from "~/utils/encode";
export const useDomain = routeLoader$((requestEvent) => {
  const url = new URL(requestEvent.request.url);
  return {url,domain:requestEvent.request.url};
   
});
export default component$(() => {
  const getURL = useDomain();

  return (
    <>
     <div class="display-flex fixed left-0 top-0 flex h-screen w-full flex-col items-start justify-center gap-8 bg-gray-100 p-4 ">
  <div class="self-center">
    <img width="100" height="100" src="https://framerusercontent.com/images/6XDWIpF2bWm2Z9TzNiJlbayc8bA.png" alt="Image description here" class="rounded-full" />
  </div>
  <div class="self-start">
  
    <h1 class=" font-bold">{`https://${getURL.value.url.host}/og/${encodeToHex(getURL.value.domain) + ".png"}`}</h1>
  </div>
</div>

    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const {url,domain} = resolveValue(useDomain);
   return metadata({frameInputText:"say something",
   title:"farcaster",
   description:"frame",
   ogImage:`https://${url.host}/og/${encodeToHex(domain) + ".png"}`,
   twitterSite:"@koisose_",
   ogImageType:"image/png",
   button:[{buttonNumber:"1",text:"submit"}],
   framePostUrl:`https://${url.host}/say/post`
  });
};