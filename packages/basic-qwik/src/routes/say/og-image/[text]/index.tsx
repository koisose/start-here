import type { RequestHandler } from '@builder.io/qwik-city';
import { fetchFont, ImageResponse, html } from 'og-img';
import { decodeFromHex } from "~/utils/encode";
export const onGet: RequestHandler = async ({ send,params }) => {
  send(
    new ImageResponse(
      // @ts-ignore
      html`
      <div class="flex min-h-screen items-center justify-center bg-gray-100">
      <p class="text-center text-5xl font-bold">${decodeFromHex(params.text)}</p>
    </div>
      `,
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: 'Roboto',
            // Use `fs` (Node.js only) or `fetch` to read font file
            data: await fetchFont(
              'https://cdn.statically.io/gh/openmaptiles/fonts/e1c6ea64/roboto/Roboto-Regular.ttf'
            ),
            weight: 1000,
            style: 'normal',
          },
        ],
      }
    )
  );
};