import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import type { APIRoute } from 'astro';
import { readerAssets } from '../../../scripts/selah-ocr-assets.mjs';

// Serve the OCR workers, WASM runtimes and language models from the blog.
// These binary assets are built from the installed, locked packages.
export function getStaticPaths() {
  const resolve = createRequire(import.meta.url).resolve;
  return [...readerAssets].map(([asset, path]) => ({ params: { asset }, props: { file: resolve(path) } }));
}

export const GET: APIRoute = async ({ props, params }) => {
  const data = await readFile(props.file);
  return new Response(new Uint8Array(data), {
    headers: { 'Content-Type': params.asset!.endsWith('js') ? 'text/javascript' : params.asset!.endsWith('.txt') ? 'text/plain' : 'application/octet-stream' },
  });
};
