import assert from 'node:assert/strict';
import { mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { selahLesson } from '../src/data/selah-lesson.mjs';

// Build dist with PUBLIC_SELAH_API_URL=https://selah-qa.invalid/v1/tutor/ask,
// then run node scripts/selah-browser-qa.mjs. For external Playwright, set PLAYWRIGHT_RUNTIME
// to the package.json that resolves it. Pass --without-api for a build without an endpoint.
const args = process.argv.slice(2);
const withApi = !args.includes('--without-api');
const livePreview = args.find(argument => argument !== '--without-api');
const origin = livePreview ? new URL(livePreview).origin : 'https://selah-preview.invalid';
if (livePreview) assert.match(origin, /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/, 'Use a local preview');
const dist = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const types = {
  '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
  '.json': 'application/json', '.mjs': 'text/javascript', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.woff2': 'font/woff2',
};
const { chromium } = createRequire(process.env.PLAYWRIGHT_RUNTIME ?? import.meta.url)('playwright');
const shots = new URL('../.tmp/selah-browser-qa/', import.meta.url);
await mkdir(shots, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.QA_BROWSER_EXECUTABLE, headless: true,
});
const lessonPath = '/teaching/selah/';
const qaEndpoint = 'https://selah-qa.invalid/v1/tutor/ask';
const screenshot = (page, name) => page.screenshot({
  path: fileURLToPath(new URL(name + '.png', shots)), fullPage: true,
});

async function open(page, path) {
  const response = await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
  assert.equal(response?.status(), 200, path);
}

async function localRequest(route) {
  const target = new URL(route.request().url());
  if (target.origin !== origin) return route.abort('blockedbyclient');
  if (livePreview) return route.continue();
  try {
    let path = resolve(dist, '.' + decodeURIComponent(target.pathname));
    if (path !== dist && !path.startsWith(dist + sep)) return route.fulfill({ status: 404 });
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    await route.fulfill({ path, contentType: types[extname(path)] });
  } catch {
    await route.fulfill({ status: 404 });
  }
}

async function test(name, verify, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
  context.setDefaultTimeout(7_000);
  await context.route('**/*', localRequest);
  const page = await context.newPage();
  const scriptErrors = [];
  page.on('pageerror', error => scriptErrors.push(error.message));
  try {
    await verify(page, context);
    assert.deepEqual(scriptErrors, []);
    console.log('PASS ' + name);
  } catch (error) {
    process.exitCode = 1;
    console.error('FAIL ' + name, error);
    await screenshot(page, name + '-failure').catch(() => {});
  } finally {
    await context.close();
  }
}

function activeStep(page, id) {
  return page.locator(`[data-selah-step="${id}"]:visible`);
}

async function step(page, id) {
  await page.waitForFunction(expected => {
    const displayed = [...document.querySelectorAll('[data-selah-step]')]
      .filter(element => element.getClientRects().length > 0);
    return displayed.length === 1 && displayed[0].getAttribute('data-selah-step') === expected;
  }, id);
}

async function next(page, expected) {
  await page.locator('[data-selah-next]').click();
  await step(page, expected);
}

async function check(page, stepId, correct) {
  const quiz = selahLesson.steps.find(item => item.id === stepId).quiz;
  const choice = quiz.options.find(option => correct ? option.id === quiz.answerId : option.id !== quiz.answerId);
  const section = activeStep(page, stepId);
  await section.locator(`[data-selah-quiz] input[value="${choice.id}"]`).check();
  await section.locator('[data-selah-check]').click();
  await section.locator('[data-selah-quiz-feedback]').waitFor();
}

async function noOverflow(page) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
}

try {
  await test('localized-entry-points', async page => {
    for (const prefix of ['', '/zh']) {
      const href = prefix + lessonPath;
      const lessonLink = `a[href="${href}"]`;
      await open(page, prefix + '/projects/selah/');
      await page.locator(lessonLink).first().waitFor();
      await open(page, prefix + '/teaching/');
      const directoryCard = page.locator('[data-teaching-resource]').filter({ has: page.locator(lessonLink) });
      assert.equal(await directoryCard.count(), 1);
      await open(page, prefix + '/teaching/macau-school-math-competition/2023-2024-senior/');
      assert.equal(await page.locator(`#question-5 ${lessonLink}`).count(), 1);
    }
  });

  await test('desktop-quiz-and-resume', async page => {
    await open(page, lessonPath);
    await step(page, 'domain');
    await next(page, 'explore');
    const slider = page.locator('[data-selah-slider]:visible');
    const sum = page.locator('[data-selah-value="sum"]:visible');
    await slider.focus();
    await slider.press('Home');
    assert.equal(Number(await slider.inputValue()), 3);
    const minSum = await sum.textContent();
    await slider.press('ArrowRight');
    assert.ok(Number(await slider.inputValue()) > 3);
    assert.notEqual(await sum.textContent(), minSum);
    assert.equal(await slider.evaluate(element => document.activeElement === element), true);
    await check(page, 'explore', false);
    const answer = activeStep(page, 'explore').locator('[data-selah-show-answer]');
    await answer.waitFor();
    assert.equal(await page.locator('[data-selah-next]').isDisabled(), true);
    await answer.click();
    await next(page, 'prove');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await step(page, 'prove');
    await open(page, lessonPath + '?resume=1');
    await step(page, 'prove');
    await page.locator('[data-language-switch]').click();
    await page.waitForURL(url => url.pathname === '/zh' + lessonPath);
    await step(page, 'prove');
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-Hant');
    await check(page, 'prove', true);
    await next(page, 'review');
    await noOverflow(page);
    await screenshot(page, 'desktop-review-zh');
  });

  await test('mobile-board', async page => {
    await open(page, '/zh' + lessonPath);
    await step(page, 'domain');
    await next(page, 'explore');
    await noOverflow(page);
    const slider = page.locator('[data-selah-slider]:visible');
    await slider.scrollIntoViewIfNeeded();
    const bounds = await slider.boundingBox();
    assert.ok(bounds && bounds.width > 100);
    const before = await slider.inputValue();
    const destination = Number(before) > 4.5 ? 0.2 : 0.8;
    await page.touchscreen.tap(bounds.x + bounds.width * destination, bounds.y + bounds.height / 2);
    assert.notEqual(await slider.inputValue(), before);
    await screenshot(page, 'mobile-explore-zh');
  }, { viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });

  await test('authored-lesson-without-javascript', async page => {
    await open(page, lessonPath);
    for (const item of selahLesson.steps) await activeStep(page, item.id).waitFor();
    assert.equal(await page.locator('[data-selah-ask-form]:visible').count(), 0);
    await noOverflow(page);
  }, { javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  if (process.env.SELAH_QA_PREVIEW_IMAGE) await test('desktop-board-preview', async page => {
    await open(page, '/zh' + lessonPath);
    await step(page, 'domain');
    await next(page, 'explore');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: process.env.SELAH_QA_PREVIEW_IMAGE, fullPage: true });
  });

  if (!withApi) await test('unconfigured-answers', async page => {
    await open(page, lessonPath);
    await step(page, 'domain');
    assert.equal(await page.locator('[data-selah-ask-form]').count(), 0);
    await page.getByText('AI answers are currently unavailable.', { exact: false }).waitFor();
    await next(page, 'explore');
    await check(page, 'explore', true);
    await next(page, 'prove');
  });

  if (withApi) await test('mock-answers-and-service-error', async (page, context) => {
    const requests = [];
    const answer = 'Reviewed explanation <em>shown as text</em>.';
    const replies = [
      { status: 200, json: { answer, referenceStepId: 'explore' } },
      { status: 403, json: { error: 'invalid_invite' } },
      { status: 429, json: { error: 'quota_exhausted' } },
      { status: 503, json: { error: 'unavailable' } },
    ];
    await context.route(qaEndpoint, async route => {
      const request = route.request();
      const headers = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };
      if (request.method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers });
        return;
      }
      requests.push({
        method: request.method(),
        body: request.postDataJSON(),
        auth: await request.headerValue('authorization'),
      });
      await route.fulfill({
        ...(replies[requests.length - 1] ?? replies.at(-1)),
        headers,
      });
    });
    await open(page, lessonPath);
    await next(page, 'explore');
    const form = page.locator('[data-selah-ask-form]');
    await form.locator('[data-selah-invite-code]').fill('selah-QA-only-invite');
    const question = 'What stays constant here?';
    const submit = async text => {
      await form.locator('[data-selah-question]').fill(text);
      await form.locator('[data-selah-ask-submit]').click();
    };
    await submit(question);
    const reply = page.locator('[data-selah-answer-text]');
    await reply.waitFor();
    assert.equal((await reply.textContent()).trim(), answer);
    assert.equal(await reply.locator('em').count(), 0);
    assert.deepEqual(requests[0], {
      method: 'POST',
      body: { lessonId: selahLesson.id, stepId: 'explore', locale: 'en', question },
      auth: 'Bearer selah-QA-only-invite',
    });
    const reference = page.locator('[data-selah-answer-reference]');
    const hash = new URL(await reference.evaluate(link => link.href)).hash;
    assert.ok(hash);
    assert.equal(await activeStep(page, 'explore').evaluate((element, id) => {
      const target = document.getElementById(id);
      return target !== null && (element === target || element.contains(target));
    }, decodeURIComponent(hash.slice(1))), true);
    await step(page, 'explore');
    for (const notice of [/invalid or has expired/i, /question limit/i, /unavailable right now/i]) {
      await submit('Can you explain this line?');
      await page.locator('[data-selah-ask-status]').filter({ hasText: notice }).waitFor();
      await step(page, 'explore');
    }
    assert.equal(requests.length, 4);
    const storage = await page.evaluate(() => JSON.stringify({ ...localStorage }));
    assert.equal(storage.includes('selah-QA-only-invite') || storage.includes(question), false);
    await check(page, 'explore', true);
    await next(page, 'prove');
  });
} finally {
  await browser.close();
}
