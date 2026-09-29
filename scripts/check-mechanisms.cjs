const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
      const videos = page.locator('.mechanism-film video');
      assert.equal(await videos.count(), 3);
      for (let i = 0; i < 3; i++) {
        const video = videos.nth(i);
        await video.scrollIntoViewIfNeeded();
        await page.waitForFunction(i => {
          const v = document.querySelectorAll('.mechanism-film video')[i];
          return v.videoWidth === 1280 && v.videoHeight === 500 && v.currentTime > 0;
        }, i);
        assert.ok(await video.evaluate(v => v.controls && v.muted && v.loop));
        const before = await video.evaluate(v => v.currentTime);
        await page.waitForTimeout(300);
        assert.ok(await video.evaluate((v, t) => v.currentTime > t, before));
        await page.locator('.mechanism-film').nth(i).screenshot({ path: path.resolve(__dirname, `../qa/mechanism-${width}-${i}.png`) });
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(100);
      assert.ok(await videos.evaluateAll(items => items.every(v => v.paused)));
      await videos.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      assert.ok(await videos.first().evaluate(v => v.paused));
      await page.close();
      console.log(`${width}px: dimensions, playback, reduced motion, and overflow passed`);
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
