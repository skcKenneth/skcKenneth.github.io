import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Pass the deployed origin or an Astro preview origin. All sample files are made in memory.
const site = new URL(process.argv[2]);
const { chromium } = createRequire(process.env.PLAYWRIGHT_RUNTIME ?? import.meta.url)('playwright');
const browser = await chromium.launch({ executablePath: process.env.QA_BROWSER_EXECUTABLE, headless: true });
try {
  const sample = await browser.newPage({ viewport: { width: 960, height: 180 } });
  const question = '2022/23 Q6';
  await sample.setContent('<body style="padding:15px;background:white;color:black;font:60px Arial,sans-serif">' + question + '</body>');
  const photo = await sample.screenshot();
  const pdf = await sample.pdf();
  await sample.setContent('<p>First page</p><p style="break-before:page">Second page</p>');
  const twoPages = await sample.pdf();
  const radicalText = 'Find the maximum of √(x − 7) + √(25 − x).';
  await sample.setContent('<body style="margin:18px;font:34px Arial;color:#111;background:#fff">Find the maximum of ' +
    '<math style="font-size:40px"><msqrt><mrow><mi>x</mi><mo>−</mo><mn>7</mn></mrow></msqrt><mo>+</mo><msqrt><mrow><mn>25</mn><mo>−</mo><mi>x</mi></mrow></msqrt></math>.</body>');
  const radicalPhoto = await sample.screenshot();
  await sample.setContent('<img style="width:90%" src="data:image/png;base64,' + radicalPhoto.toString('base64') + '" alt="">');
  await sample.locator('img').evaluate(image => image.decode());
  const scannedPdf = await sample.pdf();
  await sample.close();

  for (const prefix of ['', '/zh']) {
    const page = await browser.newPage({ viewport: { width: prefix ? 390 : 1280, height: 860 } });
    const external = new Set();
    page.on('request', request => {
      if (['fetch', 'xhr', 'worker'].includes(request.resourceType()) && request.url().startsWith('http') && new URL(request.url()).origin !== site.origin) external.add(request.url());
    });
    await page.goto(new URL(prefix + '/teaching/selah/', site).href);
    await page.locator('#selah-bring summary').click();
    const text = page.locator('[data-si-input]');
    const check = page.locator('[data-si-review]');
    const result = page.locator('[data-si-result]');
    const file = page.locator('[data-si-file]');
    await page.evaluate(() => window.addEventListener('selah:lesson', e => { document.body.dataset.intakeSmokeLesson = e.detail.id; }));
    await page.locator('[data-si-example]').click();
    await check.click();
    assert.match(await page.locator('[data-si-question]').innerText(), /10/);
    await page.locator('[data-si-confirm]').click();
    assert.equal(await page.locator('body').getAttribute('data-intake-smoke-lesson'), 'root-sum:2:10');
    await text.fill('Find the angle in the diagram');
    await check.click();
    assert.ok(await result.isHidden());
    assert.match(await page.locator('[data-si-status]').innerText(), /diagram|附圖/);
    await file.setInputFiles({ name: 'two-pages.pdf', mimeType: 'application/pdf', buffer: twoPages });
    await page.waitForFunction(() => /multiple pages|多過一頁/.test(document.querySelector('[data-si-status]').textContent), { }, { timeout: 30000 });
    for (const [name, mimeType, data] of [['photo.png', 'image/png', photo], ['paper.pdf', 'application/pdf', pdf]]) {
      await file.setInputFiles({ name, mimeType, buffer: data });
      await page.waitForFunction(() => !!document.querySelector('[data-si-input]').value.trim(), {}, { timeout: 90000 });
      const extracted = await text.inputValue();
      // The original and editable draft are both visible before the confirmation button is offered.
      assert.ok(await page.locator('[data-si-preview]').isVisible());
      assert.match(extracted, /2022/);
      assert.ok(await result.isHidden());
      if (!/^2022\s*\/\s*23\s*Q6$/i.test(extracted.trim())) await text.fill(question);
      await check.click();
      assert.match(await page.locator('[data-si-source]').innerText(), /Q6/);
      await page.locator('[data-si-confirm]').click();
      assert.equal(await page.locator('body').getAttribute('data-intake-smoke-lesson'), 'macau-2022-2023-senior-q6');
      console.log(prefix || '/en', name, JSON.stringify(extracted.trim().slice(0, 50)), '→ reviewed Q6');
    }
    const radicalFile = prefix ? { name: 'radicals-scan.pdf', mimeType: 'application/pdf', buffer: scannedPdf }
      : { name: 'radicals.png', mimeType: 'image/png', buffer: radicalPhoto };
    await file.setInputFiles(radicalFile);
    await page.waitForFunction(() => !!document.querySelector('[data-si-input]').value.trim(), {}, { timeout: 90000 });
    const extracted = (await text.inputValue()).trim();
    assert.match(extracted, /maximum|25/i);
    assert.ok(await result.isHidden());
    assert.ok(await page.locator('[data-si-preview]').isVisible());
    const corrected = extracted.replace(/\s/g, '') !== radicalText.replace(/\s/g, '');
    if (corrected) await text.fill(radicalText);
    await check.click();
    assert.match(await page.locator('[data-si-question]').innerText(), /25/);
    await page.locator('[data-si-confirm]').click();
    assert.equal(await page.locator('body').getAttribute('data-intake-smoke-lesson'), 'root-sum:7:25');
    await page.locator('[data-studio] [data-chapters]').selectOption('witness');
    assert.match(await page.locator('[data-studio] [data-equation]').innerText(), /x = 16.*max\(u \+ v\) = 6/);
    console.log(prefix || '/en', radicalFile.name, JSON.stringify(extracted.slice(0, 100)), corrected ? '→ corrected against original' : '→ verified unchanged', '→ x = 16, maximum = 6');
    assert.equal(external.size, 0, JSON.stringify([...external]));
    await page.close();
  }
} finally {
  await browser.close();
}
