import { getCollection } from 'astro:content';
import { createWritingFeed } from '../../data/reader-utils.mjs';
export async function GET() {
  const entries = await getCollection('writingZh');
  return new Response(createWritingFeed(entries, 'zh-Hant'), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
