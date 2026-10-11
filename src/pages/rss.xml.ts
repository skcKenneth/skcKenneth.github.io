import { getCollection } from 'astro:content';
import { createWritingFeed } from '../data/reader-utils.mjs';
export async function GET() {
  const entries = await getCollection('writing');
  return new Response(createWritingFeed(entries), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
