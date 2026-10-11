import { readFileSync, statSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
// Astro bundles this module into dist/.prerender; public files remain at the project root.
const publicRoot = resolve(process.cwd(), 'public');
const manifests = ['mathematical-modeling-lecture-materials', 'macau-school-math-competition-2019-2026'].map(slug => ({ slug, data: JSON.parse(readFileSync(resolve(publicRoot, 'resources', slug, 'manifest.json'), 'utf8').replace(/^\uFEFF/, '')) }));
export function formatBytes(bytes, locale = 'en') {
  if (!Number.isFinite(bytes)) return locale === 'zh-Hant' ? '大小未提供' : 'Size not provided';
  const unit = bytes >= 1024 * 1024 ? 'MB' : bytes >= 1024 ? 'KB' : 'B';
  const amount = bytes / (unit === 'MB' ? 1024 * 1024 : unit === 'KB' ? 1024 : 1);
  return `${new Intl.NumberFormat(locale === 'zh-Hant' ? 'zh-Hant-TW' : 'en-GB', { maximumFractionDigits: 1 }).format(amount)} ${unit}`;
}
/**
 * @param {string} url
 * @param {{format?:string,locale?:string,version?:string,license?:string,licenseUrl?:string,sourceUrl?:string,officialSource?:string}} declared
 * @returns {{url:string,format?:string,bytes?:number,locale?:string,version?:string,license?:string,licenseUrl?:string,sourceUrl?:string,officialSource?:string}}
 */
export function downloadMetadata(url, declared = {}) {
  const clean = String(url || '').split(/[?#]/)[0];
  const result = { url, format: extname(clean).slice(1).toUpperCase() || undefined, bytes: undefined, ...declared };
  if (!clean.startsWith('/') || clean.startsWith('//')) return result;
  const target = resolve(publicRoot, '.' + decodeURIComponent(clean));
  if (!target.startsWith(publicRoot.endsWith(sep) ? publicRoot : publicRoot + sep)) return result;
  try { result.bytes = statSync(target).size; } catch { /* Missing assets are caught by publication checks. */ }
  const manifest = manifests.find(item => clean.startsWith(`/resources/${item.slug}/`));
  if (!manifest) return result;
  const assets = manifest.data.assets || [...(manifest.data.collections || []), ...(manifest.data.datasets || []), ...(manifest.data.units || []).flatMap(unit => Object.values(unit.documents || {}))];
  const asset = assets.find(item => clean === `/resources/${manifest.slug}/${item.file}`);
  return { ...result, locale: declared.locale || asset?.locale, version: manifest.data.revision_date || manifest.data.release_date, license: manifest.data.license?.name || manifest.data.license, licenseUrl: manifest.data.license?.url, sourceUrl: `/resources/${manifest.slug}/manifest.json`, officialSource: manifest.data.official_source?.archive_url };
}
